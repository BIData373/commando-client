import { useMemo, useState } from 'react'
import styled from '@emotion/styled'
import { type ColumnDef, type RowSelectionState } from '@tanstack/react-table'
import { Outlet, createFileRoute, useNavigate } from '@tanstack/react-router'
import { differenceInDays, format, startOfToday } from 'date-fns'
import {
  AlertTriangle,
  ChevronDown,
  Columns3,
  Download,
  FilterX,
  Flag,
  MoreHorizontal,
  Paperclip,
  Plus,
  Search,
} from 'lucide-react'
import { Checkbox } from '../../../../components/ui/checkbox'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../../../../components/ui/card'
import { DataTable } from '../../../../components/ui/data-table'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../../../components/ui/tooltip'
import { StatusCell, StatusChip, STATUS_LABELS, type DirectiveStatus, getStatusStyle } from '../../../../components/Tasks/StatusCell'
import { ResponsibleCell, type Assignee, type RelatedDirective } from '../../../../components/Tasks/ResponsibleCell'
import { TopicCell } from '../../../../components/Tasks/TopicCell'
import { RowActionsMenu } from '../../../../components/Tasks/RowActionsMenu'
import { BulkActionsBar } from '../../../../components/Tasks/BulkActionsBar'
import { NoResultsFound } from '../../../../components/Tasks/NoResultsFound'
import { TopicFilterDropdown } from '../../../../components/Tasks/TopicFilterDropdown'
import { exportToExcel } from '../../../../functions/exportExcel'
import { useTitleBar } from '../../../../providers/TitleBarProvider'

const TABLE_BORDER = '0.5px solid rgba(0, 0, 0, 0.15)'

type View = 'TABLE' | 'CARDS'
type DeadlineType = 'date' | 'immediate' | 'ongoing'
type QuickFilter = 'overdue' | 'approaching' | 'flagged'

export const Route = createFileRoute('/workspace/$urlName/tasks')({
  component: TasksLayout,
  validateSearch: (search: Record<string, unknown>): { view: View } => ({
    view: search.view === 'CARDS' ? 'CARDS' : 'TABLE',
  }),
  staticData: {
    header: {
      title: 'הנחיות',
      user: true,
      navigation: true,
      workspace: true,
    },
  },
})

interface Task {
  id: number
  title: string
  details?: string
  flagged: boolean
  status: DirectiveStatus
  responsible: Assignee | null
  relatedDirectives: RelatedDirective[]
  deadlineType: DeadlineType
  dueDate: Date | null
  isOverdue: boolean
  discussionName: string
  discussionDate: string
  hasAttachment: boolean
  attachmentUrl: string | null
  tags: string[]
  notes: string
  createdAt: Date
  updatedAt: Date
}

const DEADLINE_LABELS: Record<DeadlineType, string> = {
  date: 'תאריך',
  immediate: 'מיידי',
  ongoing: 'שוטף',
}

const ASSIGNEES: Record<number, Assignee> = {
  1: { id: 1, initials: 'מג', colorToken: 'cyan', name: 'יוסי לוי', role: 'מג"ד 373', email: 'yosi.levi@idf.il' },
  2: { id: 2, initials: 'דל', colorToken: 'blue', name: 'דן לבנה', role: 'סא"ל 142', email: 'dan.levana@idf.il' },
  3: { id: 3, initials: 'אב', colorToken: 'orange', name: 'אבי בכר', role: 'מ"מ 3', email: 'avi.bachar@idf.il' },
  4: { id: 4, initials: 'רי', colorToken: 'green', name: 'רון ישראלי', role: 'מ"מ 7', email: 'ron.israeli@idf.il' },
  5: { id: 5, initials: 'שמ', colorToken: 'green', name: 'שמואל מזרחי', role: 'קצ"ר', email: 'shmuel.mizrahi@idf.il' },
  6: { id: 6, initials: 'נת', colorToken: 'blue', name: 'נתן אברהם', role: 'מג"ד 375', email: 'natan.avraham@idf.il' },
  7: { id: 7, initials: 'הל', colorToken: 'orange', name: 'הלל שמש', role: 'מג"ד 376', email: 'hillel.shemesh@idf.il' },
  8: { id: 8, initials: 'מי', colorToken: 'cyan', name: 'מיכאל גלעד', role: 'מג"ד 377', email: 'michael.gilead@idf.il' },
  9: { id: 9, initials: 'אל', colorToken: 'green', name: 'אלון פרץ', role: 'מג"ד 378', email: 'alon.peretz@idf.il' },
}

const INITIAL_TASKS: Task[] = [
  {
    id: 56,
    title: 'בדיקת כשירות רכבים מבצעיים',
    details: 'בדיקת רכבי פלוגה א׳',
    flagged: false,
    status: 'not_started',
    responsible: ASSIGNEES[1],
    relatedDirectives: [
      { user: ASSIGNEES[7], status: 'not_started' },
      { user: ASSIGNEES[8], status: 'in_progress' },
      { user: ASSIGNEES[8], status: 'in_progress' },
      { user: ASSIGNEES[8], status: 'in_progress' },
    ],
    deadlineType: 'ongoing',
    dueDate: new Date('2026-12-03'),
    isOverdue: false,
    discussionName: 'ישיבת מפקדים',
    discussionDate: '15/01',
    hasAttachment: false,
    attachmentUrl: null,
    tags: ['ביטחון'],
    notes: '',
    createdAt: new Date('2026-01-10'),
    updatedAt: new Date('2026-03-15'),
  },
  {
    id: 1,
    title: 'סיור ביטחוני - מחסום צפון',
    flagged: true,
    status: 'in_progress',
    responsible: ASSIGNEES[2],
    relatedDirectives: [],
    deadlineType: 'date',
    dueDate: new Date('2026-03-30'),
    isOverdue: false,
    discussionName: 'ישיבת מפקדים',
    discussionDate: '10/03',
    hasAttachment: true,
    attachmentUrl: 'https://example.com/files/sior-north.pdf',
    tags: ['ביטחון', 'מבצעים', 'סיורים', 'מחסומים', 'צפון'],
    notes: 'יש לתאם עם מפקד הסיור לפני יציאה',
    createdAt: new Date('2026-03-10'),
    updatedAt: new Date('2026-03-11'),
  },
  {
    id: 8,
    title: 'הכנת ציוד לאימון שטח',
    details: 'הקצאת ערכת מגא"ס מול ענף כשירויות',
    flagged: true,
    status: 'not_started',
    responsible: ASSIGNEES[3],
    relatedDirectives: [
      { user: ASSIGNEES[4], status: 'not_started' },
    ],
    deadlineType: 'immediate',
    dueDate: null,
    isOverdue: false,
    discussionName: 'ישיבת פיקוד',
    discussionDate: '12/03',
    hasAttachment: false,
    attachmentUrl: null,
    tags: ['אימון'],
    notes: 'לוודא ציוד מלא',
    createdAt: new Date('2026-03-12'),
    updatedAt: new Date('2026-03-12'),
  },
  {
    id: 10,
    title: 'דוח מצב שבועי',
    flagged: false,
    status: 'completed',
    responsible: ASSIGNEES[5],
    relatedDirectives: [],
    deadlineType: 'date',
    dueDate: new Date('2026-03-19'),
    isOverdue: true,
    discussionName: 'דיון שבועי',
    discussionDate: '14/03',
    hasAttachment: false,
    attachmentUrl: null,
    tags: ['דיווח'],
    notes: 'יש לכלול נתוני נוכחות ומשימות פתוחות',
    createdAt: new Date('2026-03-14'),
    updatedAt: new Date('2026-03-15'),
  },
  {
    id: 21,
    title: 'הערכות לחורף',
    flagged: false,
    status: 'in_progress',
    responsible: ASSIGNEES[6],
    relatedDirectives: [
      { user: ASSIGNEES[7], status: 'not_started' },
      { user: ASSIGNEES[8], status: 'in_progress' },
      { user: ASSIGNEES[9], status: 'not_started' },
    ],
    deadlineType: 'ongoing',
    dueDate: new Date('2026-12-01'),
    isOverdue: false,
    discussionName: 'ישיבת מפקדים',
    discussionDate: '15/02',
    hasAttachment: true,
    attachmentUrl: 'https://example.com/files/winter-prep.pdf',
    tags: ['לוגיסטיקה', 'תשתיות'],
    notes: '',
    createdAt: new Date('2026-02-15'),
    updatedAt: new Date('2026-03-01'),
  },
  {
    id: 89,
    title: 'בדיקת ציוד - מחסן 4',
    flagged: true,
    status: 'not_started',
    responsible: null,
    relatedDirectives: [],
    deadlineType: 'date',
    dueDate: new Date('2026-03-18'),
    isOverdue: true,
    discussionName: 'בדיקה שוטפת',
    discussionDate: '15/03',
    hasAttachment: false,
    attachmentUrl: null,
    tags: ['לוגיסטיקה'],
    notes: '',
    createdAt: new Date('2026-03-15'),
    updatedAt: new Date('2026-03-15'),
  },
]

function TasksLayout() {
  const { view } = Route.useSearch()
  const { urlName } = Route.useParams()
  const navigate = useNavigate()
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeQuickFilters, setActiveQuickFilters] = useState<Set<QuickFilter>>(new Set())
  const [activeTopicFilters, setActiveTopicFilters] = useState<Set<string>>(new Set())
  const [selectMode, setSelectMode] = useState(false)
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})

  function toggleQuickFilter(filter: QuickFilter) {
    setActiveQuickFilters((prev) => {
      const next = new Set(prev)
      if (next.has(filter)) {
        next.delete(filter)
      } else {
        next.add(filter)
      }
      return next
    })
  }

  function clearAllFilters() {
    setActiveQuickFilters(new Set())
    setActiveTopicFilters(new Set())
  }

  const allTopics = [...new Set(tasks.flatMap((t) => t.tags))]
  const hasActiveFilters = activeQuickFilters.size > 0 || activeTopicFilters.size > 0

  function matchesQuickFilter(task: Task, filter: QuickFilter): boolean {
    const today = startOfToday()
    const daysUntil = task.dueDate ? differenceInDays(task.dueDate, today) : null
    switch (filter) {
      case 'overdue':
        return daysUntil !== null && daysUntil < 0 && task.deadlineType !== 'immediate'
      case 'approaching':
        return daysUntil !== null && daysUntil >= 0 && daysUntil < 2 && !(daysUntil < 0 && task.deadlineType !== 'immediate')
      case 'flagged':
        return task.flagged
    }
  }

  const filteredTasks = useMemo(() => {
    let result = tasks
    const hasQuickFilters = activeQuickFilters.size > 0
    const hasTopicFilters = activeTopicFilters.size > 0

    if (hasQuickFilters || hasTopicFilters) {
      result = result.filter((t) => {
        const matchesQuick = hasQuickFilters && Array.from(activeQuickFilters).some((f) => matchesQuickFilter(t, f))
        const matchesTopic = hasTopicFilters && t.tags.some((tag) => activeTopicFilters.has(tag))
        return matchesQuick || matchesTopic
      })
    }

    if (searchQuery) {
      result = result.filter((t) => t.title.includes(searchQuery))
    }
    return result
  }, [tasks, searchQuery, activeQuickFilters, activeTopicFilters])
  const selectedTaskIds = Object.keys(rowSelection)
    .filter((key) => rowSelection[key])
    .map(Number)

  function highlightMatch(text: string, query: string) {
    const index = text.indexOf(query)
    if (index === -1) return text
    return (
      <>
        {text.slice(0, index)}
        <HighlightMark>{text.slice(index, index + query.length)}</HighlightMark>
        {text.slice(index + query.length)}
      </>
    )
  }

  function updateTaskStatus(taskId: number, status: DirectiveStatus) {
    setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, status, updatedAt: new Date() } : t)))
  }

  function handleEdit(taskId: number) {
    navigate({ to: '/workspace/$urlName/tasks/$taskId', params: { urlName, taskId: String(taskId) }, search: { view } })
  }

  function handleEnterSelectMode() {
    setSelectMode(true)
    setRowSelection({})
  }

  function handleExitSelectMode() {
    setSelectMode(false)
    setRowSelection({})
  }

  function handleArchive(taskIds: number[]) {
    setTasks((prev) => prev.filter((t) => !taskIds.includes(t.id)))
    handleExitSelectMode()
  }

  function handleDelete(taskIds: number[]) {
    setTasks((prev) => prev.filter((t) => !taskIds.includes(t.id)))
  }

  function getDeadlineDateStyle(task: Task) {
    if (!task.dueDate || task.deadlineType === 'immediate') return {}
    const today = startOfToday()
    const daysUntil = differenceInDays(task.dueDate, today)
    if (daysUntil < 0) return { fontColor: '#f5222d' }
    if (daysUntil < 2) return { fontColor: '#d46b08' }
    return {}
  }

  function handleExport() {
    exportToExcel<Task>(filteredTasks, [
      { header: 'מס"ד', accessor: (t) => String(t.id) },
      { header: 'ההנחיה', accessor: (t) => t.details ? `${t.title} – ${t.details}` : t.title },
      { header: 'סטטוס', accessor: (t) => ({
        value: STATUS_LABELS[t.status],
        ...getStatusStyle(t.status),
      }) },
      { header: 'אחראי', accessor: (t) => t.responsible?.name ?? '' },
      { header: 'תג"ב - סוג', accessor: (t) => DEADLINE_LABELS[t.deadlineType] },
      { header: 'תג"ב - תאריך', accessor: (t) => ({
        value: t.dueDate ? format(t.dueDate, 'dd/MM/yy') : '',
        ...getDeadlineDateStyle(t),
      }) },
      { header: 'מקור', accessor: (t) => `${t.discussionName} | ${t.discussionDate}` },
      { header: 'קובץ מצורף', accessor: (t) => t.attachmentUrl
        ? { value: 'קובץ', link: t.attachmentUrl }
        : 'אין'
      },
      { header: 'נושא', accessor: (t) => t.tags.join(', ') },
      { header: 'הערות', accessor: (t) => t.notes },
      { header: 'תאריך יצירה', accessor: (t) => format(t.createdAt, 'dd/MM/yy') },
      { header: 'עודכן ב', accessor: (t) => format(t.updatedAt, 'dd/MM/yy') },
    ], 'הנחיות')
  }

  function handleBulkChangeStatus(status: DirectiveStatus) {
    setTasks((prev) =>
      prev.map((t) => (selectedTaskIds.includes(t.id) ? { ...t, status, updatedAt: new Date() } : t)),
    )
  }

  const columns: ColumnDef<Task>[] = [
    selectMode
      ? {
          id: 'select',
          size: 61,
          header: () => (
            <CheckboxCenter>
              <Checkbox
                checked={tasks.length > 0 && selectedTaskIds.length === tasks.length}
                onCheckedChange={(checked) => {
                  if (checked) {
                    const all: RowSelectionState = {}
                    tasks.forEach((t) => { all[String(t.id)] = true })
                    setRowSelection(all)
                  } else {
                    setRowSelection({})
                  }
                }}
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
          cell: ({ getValue }) => <IdCell>{getValue() as number}</IdCell>,
        },
    {
      accessorKey: 'title',
      header: 'ההנחיה',
      size: 832,
      cell: ({ row }) => {
        const { title, details, flagged } = row.original
        const fullText = details ? `${title} – ${details}` : title
        return (
          <TitleCell>
            {flagged && <Flag size={16} color="#FAAD14" />}
            <span>{searchQuery ? highlightMatch(fullText, searchQuery) : fullText}</span>
          </TitleCell>
        )
      },
    },
    {
      accessorKey: 'status',
      header: 'סטטוס',
      size: 100,
      cell: ({ row }) => (
        <StatusCell
          status={row.original.status}
          taskId={row.original.id}
          onUpdate={updateTaskStatus}
        />
      ),
    },
    {
      id: 'responsible',
      header: 'אחראי',
      size: 115,
      cell: ({ row }) => (
        <ResponsibleCell
          responsible={row.original.responsible}
          relatedDirectives={row.original.relatedDirectives}
        />
      ),
    },
    {
      accessorKey: 'deadlineType',
      header: 'תג"ב',
      size: 160,
      cell: ({ row }) => {
        const { deadlineType, dueDate } = row.original
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
    {
      accessorKey: 'discussionName',
      header: 'מקור',
      size: 280,
      cell: ({ row }) => {
        const { discussionName, discussionDate, hasAttachment } = row.original
        return (
          <SourceCell>
            {hasAttachment && <Paperclip size={16} />}
            <SourceText>{discussionName} | {discussionDate}</SourceText>
          </SourceCell>
        )
      },
    },
    {
      accessorKey: 'tags',
      header: 'נושא',
      size: 160,
      cell: ({ getValue }) => <TopicCell tags={getValue() as string[]} />,
    },
    {
      accessorKey: 'notes',
      header: 'הערות',
      size: 220,
      cell: ({ getValue }) => <NotesText>{getValue() as string}</NotesText>,
    },
    {
      accessorKey: 'createdAt',
      header: 'תאריך יצירה',
      size: 132,
      cell: ({ getValue }) => <DateText>{format(getValue() as Date, 'dd/MM/yy')}</DateText>,
    },
    {
      accessorKey: 'updatedAt',
      header: 'עודכן ב',
      size: 100,
      cell: ({ getValue }) => <DateText>{format(getValue() as Date, 'dd/MM/yy')}</DateText>,
    },
    {
      id: 'actions',
      size: 43,
      cell: ({ row }) => (
        <RowActionsMenu
          trigger={
            <ActionsButton>
              <MoreHorizontal size={16} />
            </ActionsButton>
          }
          onEdit={() => handleEdit(row.original.id)}
          onEnterSelect={handleEnterSelectMode}
          onArchive={() => handleArchive([row.original.id])}
          onDelete={() => handleDelete([row.original.id])}
        />
      ),
    },
  ]

  function handleCreateDirective() {
    navigate({ to: '/workspace/$urlName/tasks/new', params: { urlName }, search: { view } })
  }

  function handleViewChange(newView: View) {
    navigate({ to: '/workspace/$urlName/tasks', params: { urlName }, search: { view: newView } })
  }

  useTitleBar(
    () => (
      <ButtonGroup>
        <CreateButton onClick={handleCreateDirective}>
          <Plus size={18} color="white" />
          <CreateButtonText>צור הנחייה</CreateButtonText>
          <ChevronDown size={18} color="white" />
        </CreateButton>
        <SectionDivider />
        <SegmentedControl>
          <SegmentedItem
            $selected={view === 'CARDS'}
            onClick={() => handleViewChange('CARDS')}
          >
            כרטיסיות
          </SegmentedItem>
          <SegmentedItem
            $selected={view === 'TABLE'}
            onClick={() => handleViewChange('TABLE')}
          >
            טבלה
          </SegmentedItem>
        </SegmentedControl>
      </ButtonGroup>
    ),
    [view, urlName],
  )

  return (
    <TooltipProvider>
      <TasksRoot>
        <Toolbar>
          <ToolbarStart>
            <ActionButton>
              <Columns3 size={16} />
              תצוגת עמודות
            </ActionButton>
            <ActionButton onClick={handleExport}>
              <Download size={16} />
              ייצוא
            </ActionButton>
            <SearchInputWrapper>
              <SearchField
                placeholder="חפש הנחייה"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <SearchIconBox>
                <Search size={16} color="rgba(0, 0, 0, 0.25)" />
              </SearchIconBox>
            </SearchInputWrapper>
          </ToolbarStart>
          <ToolbarEnd>
            {hasActiveFilters && (
              <ClearFiltersButton onClick={clearAllFilters}>
                <FilterX size={16} />
                נקה סננים
              </ClearFiltersButton>
            )}
            <TopicFilterDropdown
              topics={allTopics}
              activeTopics={activeTopicFilters}
              onApply={setActiveTopicFilters}
              $active={activeTopicFilters.size > 0}
            />
            <FilterPill $active={activeQuickFilters.has('flagged')} onClick={() => toggleQuickFilter('flagged')}>
              חשובות
            </FilterPill>
            <Tooltip>
              <WarningTrigger>
                <FilterPill $active={activeQuickFilters.has('approaching')} onClick={() => toggleQuickFilter('approaching')}>
                  תג"ב מתקרב
                </FilterPill>
              </WarningTrigger>
              <TooltipContent>תג"ב בעוד 2 ימים או פחות</TooltipContent>
            </Tooltip>
            <FilterPill $active={activeQuickFilters.has('overdue')} onClick={() => toggleQuickFilter('overdue')}>
              חריגה מתג"ב
            </FilterPill>
            <FilterDivider />
            <FilterPill $active={!hasActiveFilters} onClick={clearAllFilters}>
              הכל
            </FilterPill>
          </ToolbarEnd>
        </Toolbar>

        {tasks.length === 0 ? (
          <NoResultsFound variant="empty" />
        ) : searchQuery && filteredTasks.length === 0 ? (
          <NoResultsFound variant="no-search-results" />
        ) : view === 'TABLE' ? (
          <TableWrapper>
            <DataTable
              columns={columns}
              data={filteredTasks}
              rowSelection={selectMode ? rowSelection : undefined}
              onRowSelectionChange={selectMode ? setRowSelection : undefined}
              getRowId={(row) => String(row.id)}
            />
          </TableWrapper>
        ) : (
          <CardGrid>
            {filteredTasks.map((task) => (
              <Card key={task.id}>
                <CardHeader>
                  <CardTitle>
                    <CardTitleRow>
                      {task.title}
                      {task.flagged && <Flag size={16} />}
                    </CardTitleRow>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <StatusChip $status={task.status}>{STATUS_LABELS[task.status]}</StatusChip>
                </CardContent>
                <CardFooter>
                  {task.deadlineType !== 'date' && (
                    <DeadlineTag $type={task.deadlineType}>{DEADLINE_LABELS[task.deadlineType]}</DeadlineTag>
                  )}
                  {task.dueDate && (
                    <CardDateText>{format(task.dueDate, 'dd/MM/yy')}</CardDateText>
                  )}
                </CardFooter>
              </Card>
            ))}
          </CardGrid>
        )}
      </TasksRoot>
      {selectMode && (
        <BulkActionsBar
          selectedCount={selectedTaskIds.length}
          onChangeStatus={handleBulkChangeStatus}
          onArchive={() => handleArchive(selectedTaskIds)}
          onDelete={() => {
            handleDelete(selectedTaskIds)
            handleExitSelectMode()
          }}
          onExitSelect={handleExitSelectMode}
        />
      )}
      <Outlet />
    </TooltipProvider>
  )
}

export default TasksLayout

// ─── Layout ───────────────────────────────────────────────────────────────────

const TasksRoot = styled.div`
  padding-block: 24px;
  display: flex;
  flex-direction: column;
  gap: 28px;
`

// ─── Title Bar Actions ───────────────────────────────────────────────────────

const ButtonGroup = styled.div`
  direction: ltr;
  display: flex;
  align-items: center;
  gap: 12px;
`

const CreateButton = styled.button`
  direction: rtl;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 40px;
  padding-inline: 15px;
  border: none;
  border-radius: 8px;
  background: linear-gradient(165deg, #615FFF 0%, #9810FA 100%);
  color: white;
  font-family: 'Rubik', sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  cursor: pointer;
  white-space: nowrap;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    box-shadow: inset 0px 2px 4px 0px rgba(0, 0, 0, 0.05);
    pointer-events: none;
  }

  &:hover {
    opacity: 0.9;
  }

  &:active {
    opacity: 0.85;
  }
`

const CreateButtonText = styled.span`
  direction: rtl;
`

const SectionDivider = styled.div`
  width: 1px;
  height: 39px;
  background: rgba(0, 0, 0, 0.15);
`

const SegmentedControl = styled.div`
  display: flex;
  align-items: center;
  height: 40px;
  padding: 2px;
  background: #f5f5f5;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
`

const SegmentedItem = styled.button<{ $selected: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  height: 100%;
  padding-inline: 12px;
  border: none;
  border-radius: 6px;
  font-family: 'Rubik', sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  white-space: nowrap;
  cursor: pointer;
  transition: background 0.15s, box-shadow 0.15s;
  background: ${({ $selected }) => ($selected ? 'white' : 'transparent')};
  color: ${({ $selected }) => ($selected ? 'rgba(0, 0, 0, 0.88)' : 'rgba(0, 0, 0, 0.65)')};
  box-shadow: ${({ $selected }) =>
    $selected
      ? '0px 1px 2px 0px rgba(0, 0, 0, 0.03), 0px 1px 6px -1px rgba(0, 0, 0, 0.02), 0px 2px 4px 0px rgba(0, 0, 0, 0.02)'
      : 'none'};

  &:hover {
    background: ${({ $selected }) => ($selected ? 'white' : 'rgba(0, 0, 0, 0.06)')};
  }
`

// ─── Toolbar ──────────────────────────────────────────────────────────────────

const Toolbar = styled.div`
direction: ltr;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 40px;
`

const ToolbarStart = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

const ToolbarEnd = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

const ActionButton = styled.button`
  direction: rtl;
  display: flex;
  align-items: center;
  gap: 8px;
  padding-inline: 15px;
  height: 40px;
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  font-size: 16px;
  color: rgba(0, 0, 0, 0.88);
  cursor: pointer;
  background: white;
  white-space: nowrap;
  box-shadow: 0px 2px 0px 0px rgba(0, 0, 0, 0.02);

  &:hover {
    background: var(--link-bg-hover);
  }
`

const SearchInputWrapper = styled.div`
  direction: rtl;
  display: flex;
  align-items: center;
  height: 40px;
  width: 222px;
  border: 0.5px solid rgba(0, 0, 0, 0.25);
  border-radius: 6px;
  background: white;
  overflow: hidden;

  &:focus-within {
    border-color: rgba(9, 88, 217, 0.6);
  }
`

const SearchIconBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-inline: 8px;
`

const SearchField = styled.input`
  flex: 1;
  height: 100%;
  border: none;
  outline: none;
  background: transparent;
  font-family: 'Rubik', sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  color: rgba(0, 0, 0, 0.88);
  padding-inline: 11px;
  text-align: right;
  direction: rtl;

  &::placeholder {
    color: rgba(0, 0, 0, 0.25);
  }
`

const ClearFiltersButton = styled.button`
direction: rtl;
  display: flex;
  align-items: center;
  gap: 8px;
  padding-inline: 15px;
  height: 32px;
  border-radius: 999px;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.88);
  cursor: pointer;
  background: transparent;
  white-space: nowrap;

  &:hover {
    background: var(--link-bg-hover);
  }
`

const FilterPill = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 4px;
  padding-inline: 12px;
  height: 32px;
  border-radius: 999px;
  font-size: 14px;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.15s;
  border: 1px solid ${({ $active }) => ($active ? 'rgba(9, 88, 217, 0.6)' : '#D9D9D9')};
  background: ${({ $active }) => ($active ? 'rgba(230, 244, 255, 0.5)' : '#FFF')};
  color: ${({ $active }) => ($active ? 'rgba(9, 88, 217, 1)' : 'var(--sea-ink)')};

  &:hover {
    background: var(--link-bg-hover);
  }
`

const FilterDivider = styled.div`
  width: 1px;
  height: 25px;
  background: var(--Colors-Neutral-Text-colorTextQuaternary, rgba(0, 0, 0, 0.25));
`

// ─── Table ────────────────────────────────────────────────────────────────────

const TableWrapper = styled.div`
  border: ${TABLE_BORDER};
  overflow: auto;
  border-radius: 4px;
  background: white;

  table {
    table-layout: fixed;
  }

  tr {
    border: none;

    &:hover {
      background: var(--link-bg-hover);
    }
  }

  th {
    border: ${TABLE_BORDER};
    padding: 12px;
    font-size: 16px;
    font-weight: 500;
    line-height: 24px;
    color:rgba(0, 0, 0, 0.65);
    height: 48px;
    white-space: nowrap;
    background: white;
  }

  td {
    border: ${TABLE_BORDER};
    padding: 12px;
    height: 43px;
    vertical-align: middle;
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
  font-size: 18px;
  font-weight: 500;
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
  line-height: 22px;

  span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`

const HighlightMark = styled.mark`
  background: rgba(255, 235, 130, 0.7);
  color: inherit;
  border-radius: 2px;
  padding: 0 1px;
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


const NotesText = styled.span`
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  font-size: 14px;
  color: var(--sea-ink-soft);
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

// ─── Card view ────────────────────────────────────────────────────────────────

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
`

const CardTitleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`

const CardDateText = styled.span`
  font-size: 12px;
  color: var(--sea-ink-soft);
  margin-inline-start: auto;
`
