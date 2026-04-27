import { useState } from 'react'
import styled from '@emotion/styled'
import { type ColumnDef, type RowSelectionState } from '@tanstack/react-table'
import { differenceInDays, format, startOfToday } from 'date-fns'
import { AlertTriangle, MoreVertical, Paperclip } from 'lucide-react'
import { Checkbox } from '../ui/checkbox'
import { DataTable } from '../ui/data-table'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'
import { StatusCell, type DirectiveStatus } from './StatusCell'
import { ResponsibleCell } from './ResponsibleCell'
import { TopicCell } from './TopicCell'
import { RowActionsMenu } from './RowActionsMenu'
import { BulkActionsBar } from './BulkActionsBar'
import type { Task } from '../../data/Tasks'
import FlagIcon from '../shared/FlagIcon'
import HighlightMatch from '../shared/HighlightMatch'

export type DeadlineType = 'date' | 'immediate' | 'ongoing'

export const DEADLINE_LABELS: Record<DeadlineType, string> = {
  date: 'תאריך',
  immediate: 'מיידי',
  ongoing: 'שוטף',
}

interface TaskTableProps {
  tasks: Task[]
  searchQuery: string
  columnOrder: string[]
  hiddenColumns: Set<string>
  onUpdateStatus: (taskId: number, status: DirectiveStatus) => void
  onEdit: (taskId: number) => void
  onArchive: (taskIds: number[]) => void
  onDelete: (taskIds: number[]) => void
  onBulkChangeStatus: (taskIds: number[], status: DirectiveStatus) => void
}

function TaskTable({
  tasks,
  searchQuery,
  columnOrder,
  hiddenColumns,
  onUpdateStatus,
  onEdit,
  onArchive,
  onDelete,
  onBulkChangeStatus,
}: TaskTableProps) {
  const [selectMode, setSelectMode] = useState(false)
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})

  const selectedTaskIds = Object.keys(rowSelection)
    .filter((key) => rowSelection[key])
    .map(Number)

  function handleEnterSelectMode(taskId?: number) {
    setSelectMode(true)
    setRowSelection(taskId !== undefined ? { [String(taskId)]: true } : {})
  }

  function handleExitSelectMode() {
    setSelectMode(false)
    setRowSelection({})
  }

  function handleSelectAll(checked: boolean) {
    if (checked) {
      const all: RowSelectionState = {}
      tasks.forEach((t) => { all[String(t.id)] = true })
      setRowSelection(all)
    } else {
      setRowSelection({})
    }
  }

  const firstColumn: ColumnDef<Task> = selectMode
    ? {
      id: 'select',
      size: 61,
      header: () => (
        <CheckboxCenter>
          <Checkbox
            checked={tasks.length > 0 && selectedTaskIds.length === tasks.length}
            onCheckedChange={(checked) => handleSelectAll(!!checked)}
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
    : {
      accessorKey: 'id',
      header: 'מס"ד',
      size: 61,
      cell: ({ getValue }) => <IdCell>{getValue<number>()}</IdCell>,
    }

  const columnMap: Record<string, ColumnDef<Task>> = {
    title: {
      accessorKey: 'title',
      header: 'ההנחיה',
      size: 832,
      cell: ({ row: { original :{ title, details, flagged } } }) => (
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
    status: {
      accessorKey: 'status',
      header: 'סטטוס',
      size: 100,
      cell: ({ row: { original: { status, id } } }) => (
        <StatusCell
          status={status}
          taskId={id}
          onUpdate={onUpdateStatus}
        />
      ),
    },
    responsible: {
      id: 'responsible',
      header: 'אחראי',
      size: 115,
      cell: ({ row: { original: { responsible, relatedDirectives } } }) => (
        <ResponsibleCell
          responsible={responsible}
          relatedDirectives={relatedDirectives}
        />
      ),
    },
    deadlineType: {
      accessorKey: 'deadlineType',
      header: 'תג"ב',
      size: 160,
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
    discussionName: {
      accessorKey: 'discussionName',
      header: 'מקור',
      size: 280,
      cell: ({ row: { original: { discussionName, discussionDate, hasAttachment } } }) => (
        <SourceCell>
          {hasAttachment && <Paperclip size={16} />}
          <SourceText>{discussionName} | {discussionDate}</SourceText>
        </SourceCell>
      ),
    },
    tags: {
      accessorKey: 'tags',
      header: 'נושא',
      size: 160,
      cell: ({ getValue }) => <TopicCell tags={getValue<string[]>()} />,
    },
    notes: {
      accessorKey: 'notes',
      header: 'הערות',
      size: 220,
      cell: ({ getValue }) => {
        const notes = getValue<string>()
        return (
          <NotesText>{searchQuery ? <HighlightMatch text={notes} query={searchQuery} variant="mark" /> : notes}</NotesText>
        )
      },
    },
    createdAt: {
      accessorKey: 'createdAt',
      header: 'תאריך יצירה',
      size: 132,
      cell: ({ getValue }) => <DateText>{format(getValue<Date>(), 'dd/MM/yy')}</DateText>,
    },
    updatedAt: {
      accessorKey: 'updatedAt',
      header: 'עודכן ב',
      size: 100,
      cell: ({ getValue }) => <DateText>{format(getValue<Date>(), 'dd/MM/yy')}</DateText>,
    },
  }

  const actionsColumn: ColumnDef<Task> = {
    id: 'actions',
    size: 43,
    cell: ({ row : { original: { id } } }) => (
      <RowActionsMenu
        trigger={
          <ActionsButton>
            <MoreVertical size={16} />
          </ActionsButton>
        }
        onEdit={() => onEdit(id)}
        onEnterSelect={() => handleEnterSelectMode(id)}
        onArchive={() => onArchive([id])}
        onDelete={() => onDelete([id])}
      />
    ),
  }

  const visibleOrderedColumns = columnOrder
    .filter((id) => !hiddenColumns.has(id) && columnMap[id])
    .map((id) => columnMap[id])

  const columns: ColumnDef<Task>[] = [
    firstColumn,
    ...visibleOrderedColumns,
    actionsColumn,
  ]

  return (
    <>
      <TableWrapper>
        <DataTable
          columns={columns}
          data={tasks}
          rowSelection={selectMode ? rowSelection : undefined}
          onRowSelectionChange={selectMode ? setRowSelection : undefined}
          getRowId={(row) => String(row.id)}
        />
      </TableWrapper>
      {selectMode && (
        <BulkActionsBar
          selectedCount={selectedTaskIds.length}
          onChangeStatus={(status) => onBulkChangeStatus(selectedTaskIds, status)}
          onArchive={() => {
            onArchive(selectedTaskIds)
            handleExitSelectMode()
          }}
          onDelete={() => {
            onDelete(selectedTaskIds)
            handleExitSelectMode()
          }}
          onExitSelect={handleExitSelectMode}
        />
      )}
    </>
  )
}

export { TaskTable }

// ─── Table ────────────────────────────────────────────────────────────────────

const TableWrapper = styled.div`
  overflow: hidden;
  border-radius: 8px;
  background: white;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02);

  table {
    width: 100%;
    table-layout: fixed;
  }

  tr {
    border: none;

    &:hover {
      background: var(--link-bg-hover);
    }
  }
  th, td {
    border: 0.5px solid rgba(0, 0, 0, 0.15);
  }

  th {
    font-size: 16px;
    font-weight: 500;
    line-height: 24px;
    color:rgba(0, 0, 0, 0.65);
    height: 48px;
    white-space: nowrap;
    background: white;
  }

  td {
    padding: 0 6px;
    height: 43px;
    max-height: 43px;
    vertical-align: middle;
    overflow: hidden;
  }

  thead tr:first-child th:first-child {
    border-radius: 0 8px 0 0;
  }

  thead tr:first-child th:last-child {
    border-radius: 8px 0 0 0;
  }

  tbody tr:last-child td:first-child {
    border-radius: 0 0 8px 0;
  }

  tbody tr:last-child td:last-child {
    border-radius: 0 0 0 8px;
  }
`

// ─── Cell content ─────────────────────────────────────────────────────────────

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
  font-weight: 400;
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

const DeadlineTag = styled.span<{ $type: DeadlineType }>`
  display: inline-flex;
  align-items: center;
  padding: 1px 6px;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
  ${({ $type }) => {
    switch ($type) {
      case 'ongoing':
        return `
          background: rgba(230, 244, 255, 0.8);
          border: 1px solid rgba(145, 202, 255, 0.8);
          color: rgba(22, 119, 255, 0.9);
        `
      case 'immediate':
        return `
          background: #FFF1F0;
          border: 1px solid #FFA39E;
          color: #F5222D;
        `
      case 'date':
        return `
          background: var(--chip-bg);
          border: 1px solid var(--chip-line);
          color: var(--sea-ink-soft);
        `
    }
  }}
`

const SourceCell = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--sea-ink-soft);
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
