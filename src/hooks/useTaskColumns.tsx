import styled from '@emotion/styled'
import { type ColumnDef, type FilterFn } from '@tanstack/react-table'
import { differenceInDays, format, startOfToday } from 'date-fns'
import { AlertTriangle, MoreVertical } from 'lucide-react'
import { BsPaperclip as Paperclip } from 'react-icons/bs'
import { Checkbox } from '../components/ui/checkbox'
import { Tooltip, TooltipContent, TooltipTrigger } from '../components/ui/tooltip'
import { StatusCell } from '../components/Tasks/StatusCell'
import { ResponsibleCell } from '../components/Tasks/ResponsibleCell'
import { TopicCell } from '../components/Tasks/TopicCell'
import { RowActionsMenu } from '../components/Tasks/RowActionsMenu'
import { ColumnHeaderWithActions } from '../components/Tasks/ColumnHeaderWithActions'
import type { Task } from '../data/Tasks'
import FlagIcon from '../components/shared/FlagIcon'
import HighlightMatch from '../components/shared/HighlightMatch'
import DeadlineTag, { DEADLINE_LABELS } from '../components/shared/DeadlineTag'
import type { DirectiveStatus } from '../components/shared/StatusTag'
import { type FilterOption } from '../functions/filter-utils'

export enum TaskColumnId {
  SerialNumber = 'serialNumber',
  Title = 'title',
  Status = 'status',
  Responsible = 'responsible',
  DeadlineType = 'deadlineType',
  DiscussionName = 'discussionName',
  Tags = 'tags',
  Notes = 'notes',
  CreatedAt = 'createdAt',
  UpdatedAt = 'updatedAt',
}

export interface TaskColumnMeta {
  id: TaskColumnId
  label: string
}

export const TASK_COLUMNS_META: TaskColumnMeta[] = [
  { id: TaskColumnId.SerialNumber, label: 'מס"ד' },
  { id: TaskColumnId.Title, label: 'ההנחיה' },
  { id: TaskColumnId.Status, label: 'סטטוס' },
  { id: TaskColumnId.Responsible, label: 'אחראי' },
  { id: TaskColumnId.DeadlineType, label: 'תג"ב' },
  { id: TaskColumnId.DiscussionName, label: 'מקור' },
  { id: TaskColumnId.Tags, label: 'נושא' },
  { id: TaskColumnId.Notes, label: 'הערות' },
  { id: TaskColumnId.CreatedAt, label: 'תאריך יצירה' },
  { id: TaskColumnId.UpdatedAt, label: 'עודכן ב' },
]

const STATUS_SORT_ORDER: Record<DirectiveStatus, number> = {
  not_started: 0,
  in_progress: 1,
  completed: 2,
}

const multiSelectFilter: FilterFn<Task> = (row, columnId, filterValue: string[]) => {
  if (!filterValue?.length) return true
  const value = row.getValue(columnId)
  if (Array.isArray(value)) return value.some((v: string) => filterValue.includes(v))
  return filterValue.includes(value as string)
}

interface SelectModeConfig {
  enabled: boolean
  tasks: Task[]
  selectedTaskIds: number[]
  onSelectAll: (checked: boolean) => void
}

interface ActionsConfig {
  onEdit: (taskId: number) => void
  onArchive: (taskIds: number[]) => void
  onDelete: (taskIds: number[]) => void
  onEnterSelectMode: (taskId?: number) => void
}

interface UseTaskColumnsOptions {
  visibleColumns: TaskColumnId[]
  searchQuery: string
  filterOptionsMap: Record<string, FilterOption[]>
  onUpdateStatus: (taskId: number, status: DirectiveStatus) => void
  selectMode?: SelectModeConfig
  actions?: ActionsConfig
}

interface UseTaskColumnsReturn {
  columns: ColumnDef<Task>[]
  availableColumns: TaskColumnMeta[]
}

function useTaskColumns({
  visibleColumns,
  searchQuery,
  filterOptionsMap,
  onUpdateStatus,
  selectMode,
  actions,
}: UseTaskColumnsOptions): UseTaskColumnsReturn {

  const selectColumn: ColumnDef<Task> | null = selectMode?.enabled
    ? {
      id: 'select',
      size: 70,
      enableSorting: false,
      enableColumnFilter: false,
      header: () => (
        <CheckboxCenter>
          <Checkbox
            checked={selectMode.tasks.length > 0 && selectMode.selectedTaskIds.length === selectMode.tasks.length}
            onCheckedChange={(checked) => selectMode.onSelectAll(!!checked)}
          />
        </CheckboxCenter>
      ),
      cell: ({ row }) => (
        <CheckboxCenter>
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(checked) => row.toggleSelected(!!checked)}
          />
        </CheckboxCenter>
      ),
    }
    : null

  const columnMap: Record<TaskColumnId, ColumnDef<Task>> = {
    [TaskColumnId.SerialNumber]: {
      accessorKey: 'serialNumber',
      header: ({ column }) => <ColumnHeaderWithActions label='מס"ד' column={column} />,
      size: 70,
      enableColumnFilter: false,
      cell: ({ getValue }) => <IdCell>{getValue<number>()}</IdCell>,
    },
    [TaskColumnId.Title]: {
      accessorKey: 'title',
      header: 'ההנחיה',
      size: 400,
      meta: { grow: true },
      enableSorting: false,
      enableColumnFilter: false,
      cell: ({ row: { original: { title, details, flagged } } }) => (
        <TitleCell>
          {flagged && <FlagIcon />}
          {details ? (
            <>
              <TitlePart>{searchQuery ? <HighlightMatch text={title} query={searchQuery} variant="mark" /> : title}</TitlePart>
              <TitleSeparator> - </TitleSeparator>
              <DetailsPart>{searchQuery ? <HighlightMatch text={details} query={searchQuery} variant="mark" /> : details}</DetailsPart>
            </>
          ) : (
            <TitleFull>{searchQuery ? <HighlightMatch text={title} query={searchQuery} variant="mark" /> : title}</TitleFull>
          )}
        </TitleCell>
      ),
    },
    [TaskColumnId.Status]: {
      accessorKey: 'status',
      header: ({ column }) => <ColumnHeaderWithActions label="סטטוס" column={column} filterOptions={filterOptionsMap['status']} />,
      size: 100,
      filterFn: multiSelectFilter,
      sortingFn: (rowA, rowB) =>
        (STATUS_SORT_ORDER[rowA.original.status] ?? 0) - (STATUS_SORT_ORDER[rowB.original.status] ?? 0),
      cell: ({ row: { original: { status, id } } }) => (
        <StatusCell
          status={status}
          taskId={id}
          onUpdate={onUpdateStatus}
        />
      ),
    },
    [TaskColumnId.Responsible]: {
      id: 'responsible',
      accessorFn: (row) => row.responsible?.name ?? 'ללא אחראי',
      header: ({ column }) => <ColumnHeaderWithActions label="אחראי" column={column} filterOptions={filterOptionsMap['responsible']} />,
      size: 115,
      filterFn: multiSelectFilter,
      sortingFn: (rowA, rowB) =>
        (rowA.original.responsible?.name ?? '').localeCompare(rowB.original.responsible?.name ?? '', 'he'),
      cell: ({ row: { original: { responsible, relatedDirectives } } }) => (
        <ResponsibleCell
          responsible={responsible}
          relatedDirectives={relatedDirectives}
        />
      ),
    },
    [TaskColumnId.DeadlineType]: {
      accessorKey: 'deadlineType',
      header: ({ column }) => <ColumnHeaderWithActions label='תג"ב' column={column} filterOptions={filterOptionsMap['deadlineType']} />,
      size: 160,
      filterFn: multiSelectFilter,
      sortingFn: (rowA, rowB) => {
        const dateA = rowA.original.dueDate?.getTime() ?? Infinity
        const dateB = rowB.original.dueDate?.getTime() ?? Infinity
        return dateA - dateB
      },
      cell: ({ row: { original: { deadlineType, dueDate } } }) => {
        const today = startOfToday()
        const daysUntil = dueDate ? differenceInDays(dueDate, today) : null
        const isOverdue = daysUntil !== null && daysUntil < 0 && deadlineType !== 'immediate'
        const isApproaching = !isOverdue && daysUntil !== null && daysUntil >= 0 && daysUntil < 2

        const overdueTooltip = `חריגה של ${Math.abs(daysUntil!)} ימים`
        const approachingTooltip = daysUntil === 0 ? 'תג"ב היום' : 'תג"ב מחר'

        return (
          <DeadlineCell>
            {deadlineType !== 'date' && (
              <DeadlineTag $type={deadlineType}>{DEADLINE_LABELS[deadlineType]}</DeadlineTag>
            )}
            {dueDate && <DeadlineDateText>{format(dueDate, 'dd/MM/yy')}</DeadlineDateText>}
            {(isOverdue || isApproaching) && (
              <DeadlineWarning>
                <Tooltip>
                  <WarningTrigger>
                    {isOverdue ? <OverdueIcon size={16} /> : <ApproachingIcon size={16} />}
                  </WarningTrigger>
                  <TooltipContent>{isOverdue ? overdueTooltip : approachingTooltip}</TooltipContent>
                </Tooltip>
              </DeadlineWarning>
            )}
          </DeadlineCell>
        )
      },
    },
    [TaskColumnId.DiscussionName]: {
      accessorKey: 'discussionName',
      header: ({ column }) => <ColumnHeaderWithActions label="מקור" column={column} filterOptions={filterOptionsMap['discussionName']} />,
      size: 260,
      filterFn: multiSelectFilter,
      sortingFn: (rowA, rowB) =>
        rowA.original.discussionName.localeCompare(rowB.original.discussionName, 'he'),
      cell: ({ row: { original: { discussionName, discussionDate, hasAttachment } } }) => {
        const parts = [discussionName, discussionDate].filter(Boolean)
        return (
          <SourceCell>
            {hasAttachment && <SourceIcon size={18} />}
            {parts.length > 0 && <SourceText>{parts.join(' | ')}</SourceText>}
          </SourceCell>
        )
      },
    },
    [TaskColumnId.Tags]: {
      accessorKey: 'tags',
      header: ({ column }) => <ColumnHeaderWithActions label="נושא" column={column} filterOptions={filterOptionsMap['tags']} />,
      size: 160,
      enableSorting: false,
      filterFn: multiSelectFilter,
      cell: ({ getValue }) => <TopicCell tags={getValue<string[]>()} />,
    },
    [TaskColumnId.Notes]: {
      accessorKey: 'notes',
      header: 'הערות',
      size: 220,
      enableSorting: false,
      enableColumnFilter: false,
      cell: ({ getValue }) => {
        const notes = getValue<string>()
        return (
          <NotesText>{searchQuery ? <HighlightMatch text={notes} query={searchQuery} variant="mark" /> : notes}</NotesText>
        )
      },
    },
    [TaskColumnId.CreatedAt]: {
      accessorKey: 'createdAt',
      header: ({ column }) => <ColumnHeaderWithActions label="תאריך יצירה" column={column} />,
      size: 132,
      enableColumnFilter: false,
      sortingFn: 'datetime',
      cell: ({ getValue }) => <DateText>{format(getValue<Date>(), 'dd/MM/yy')}</DateText>,
    },
    [TaskColumnId.UpdatedAt]: {
      accessorKey: 'updatedAt',
      header: ({ column }) => <ColumnHeaderWithActions label="עודכן ב" column={column} />,
      size: 100,
      enableColumnFilter: false,
      sortingFn: 'datetime',
      cell: ({ getValue }) => <DateText>{format(getValue<Date>(), 'dd/MM/yy')}</DateText>,
    },
  }

  const actionsColumn: ColumnDef<Task> | null = actions
    ? {
      id: 'actions',
      size: 43,
      enableSorting: false,
      enableColumnFilter: false,
      cell: ({ row: { original: { id } } }) => (
        <RowActionsMenu
          trigger={
            <ActionsButton>
              <MoreVertical size={16} />
            </ActionsButton>
          }
          onEdit={() => actions.onEdit(id)}
          onEnterSelect={() => actions.onEnterSelectMode(id)}
          onArchive={() => actions.onArchive([id])}
          onDelete={() => actions.onDelete([id])}
        />
      ),
    }
    : null

  const visibleOrderedColumns = visibleColumns
    .filter((id) => columnMap[id])
    .map((id) => (selectColumn && id === TaskColumnId.SerialNumber) ? selectColumn : columnMap[id])

  const columns: ColumnDef<Task>[] = [
    ...visibleOrderedColumns,
    ...(actionsColumn ? [actionsColumn] : []),
  ]

  return {
    columns,
    availableColumns: TASK_COLUMNS_META,
  }
}

export { useTaskColumns }

// ─── Styled Components ───────────────────────────────────────────────────────

const CheckboxCenter = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`

const IdCell = styled.span`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  color:rgba(0, 0, 0, 0.65);
`

const TitleCell = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--sea-ink);
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  overflow: hidden;
`

const TitlePart = styled.span`
  font-weight: 400;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 50%;
  flex-shrink: 0;
`

const TitleSeparator = styled.span`
  flex-shrink: 0;
  white-space: nowrap;
`

const DetailsPart = styled.span`
  font-weight: 300;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
  min-width: 0;
`

const TitleFull = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const DeadlineCell = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`

const DeadlineDateText = styled.span`
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  color: rgba(0, 0, 0, 0.65);
  white-space: nowrap;
`

const DeadlineWarning = styled.span`
  margin-inline-start: auto;
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
`

const WarningTrigger = styled(TooltipTrigger)`
  display: inline-flex;
  align-items: center;
  background: none;
  border: none;
  padding: 0;
  cursor: default;
  line-height: 0;
`

const OverdueIcon = styled(AlertTriangle)`
  color: #f5222d;
  flex-shrink: 0;
`

const ApproachingIcon = styled(AlertTriangle)`
  color: rgba(212, 107, 8, 0.9);
  flex-shrink: 0;
`

const SourceCell = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--sea-ink-soft);
`

const SourceIcon = styled(Paperclip)`
  color: rgba(0, 0, 0, 0.45);
`

const SourceText = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  color: rgba(0, 0, 0, 0.65);
`

const NotesText = styled.div`
  overflow: hidden;
  max-height: 40px;

  font-size: 14px;
  line-height: 20px;
  color: var(--sea-ink-soft);

  p {
    margin: 0;
  }

  ol {
    margin: 0;
    padding-inline-start: 20px;
    list-style-type: decimal;
  }

  li {
    margin: 0;
  }

  li p {
    display: inline;
  }

  strong {
    font-weight: 600;
  }

  u {
    text-decoration: underline;
  }
`

const DateText = styled.span`
  font-size: 14px;
  color: var(--sea-ink-soft);
`

const ActionsButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 4px;
  color: var(--sea-ink-soft);
  cursor: pointer;
  transition: background 0.15s;

  &:hover {
    background: var(--link-bg-hover);
    color: var(--sea-ink);
  }
`
