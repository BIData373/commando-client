import styled from '@emotion/styled'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { Outlet, createFileRoute, useNavigate } from '@tanstack/react-router'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../../../components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../components/ui/table'
import { LayoutGrid, Table2 } from 'lucide-react'

export const Route = createFileRoute('/workspace/$urlName/tasks')({
  validateSearch: (search) => ({
    view: (search.view === 'cards' ? 'cards' : 'table') as 'table' | 'cards',
  }),
  component: TasksLayout,
  staticData: {
    header: {
      title: 'הנחיות',
      user: true,
      navigation: true,
      workspace: true,
    },
  },
})

interface MetaFields {
  id: number
  createdAt: Date
  createdBy: number
  updatedAt: Date
  updatedBy: number
  deletedAt: Date | null
  deletedBy: number | null
}

interface AssigneeTaskStatus {
  taskId: number
  assigneeId: number
  statusId: number
}

interface Task extends MetaFields {
  title: string
  description: string
  flagged: boolean
  deadlineType: string
  issuedAt: Date
  dueDate: Date
  sourceId: number
  notes: string
  workspaceId: number
  tags?: number[]
  assigneeStatuses?: AssigneeTaskStatus[]
}

const MOCK_TASKS: Task[] = [
  {
    id: 1,
    title: 'סיור ביטחוני - מחסום צפון',
    description: 'ביצוע סיור ביטחוני בסקטור הצפוני',
    flagged: true,
    deadlineType: 'hard',
    issuedAt: new Date('2026-03-10'),
    dueDate: new Date('2026-03-20'),
    sourceId: 101,
    notes: 'יש לתאם עם מפקד הסיור לפני יציאה',
    workspaceId: 1,
    tags: [1, 3],
    assigneeStatuses: [{ taskId: 1, assigneeId: 5, statusId: 2 }],
    createdAt: new Date('2026-03-10'),
    createdBy: 1,
    updatedAt: new Date('2026-03-11'),
    updatedBy: 1,
    deletedAt: null,
    deletedBy: null,
  },
  {
    id: 2,
    title: 'אימון כוחות - תרגיל לילה',
    description: 'תרגיל לילה משולב עם יחידות נוספות',
    flagged: false,
    deadlineType: 'soft',
    issuedAt: new Date('2026-03-12'),
    dueDate: new Date('2026-03-25'),
    sourceId: 102,
    notes: '',
    workspaceId: 1,
    tags: [2],
    assigneeStatuses: [
      { taskId: 2, assigneeId: 3, statusId: 1 },
      { taskId: 2, assigneeId: 7, statusId: 1 },
    ],
    createdAt: new Date('2026-03-12'),
    createdBy: 2,
    updatedAt: new Date('2026-03-12'),
    updatedBy: 2,
    deletedAt: null,
    deletedBy: null,
  },
  {
    id: 3,
    title: 'דוח מצב שבועי',
    description: 'הגשת דוח מצב שבועי למפקדה',
    flagged: false,
    deadlineType: 'milestone',
    issuedAt: new Date('2026-03-14'),
    dueDate: new Date('2026-03-16'),
    sourceId: 103,
    notes: 'יש לכלול נתוני נוכחות ומשימות פתוחות',
    workspaceId: 1,
    tags: [4],
    assigneeStatuses: [{ taskId: 3, assigneeId: 2, statusId: 3 }],
    createdAt: new Date('2026-03-14'),
    createdBy: 1,
    updatedAt: new Date('2026-03-15'),
    updatedBy: 3,
    deletedAt: null,
    deletedBy: null,
  },
  {
    id: 4,
    title: 'בדיקת ציוד - מחסן 4',
    description: 'ספירה ובדיקת תקינות ציוד במחסן 4',
    flagged: true,
    deadlineType: 'hard',
    issuedAt: new Date('2026-03-15'),
    dueDate: new Date('2026-03-18'),
    sourceId: 104,
    notes: '',
    workspaceId: 1,
    tags: [1, 5],
    assigneeStatuses: [],
    createdAt: new Date('2026-03-15'),
    createdBy: 4,
    updatedAt: new Date('2026-03-15'),
    updatedBy: 4,
    deletedAt: null,
    deletedBy: null,
  },
]

type ViewMode = 'table' | 'cards'

const columnHelper = createColumnHelper<Task>()

const columns = [
  columnHelper.accessor('title', {
    header: 'כותרת',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('deadlineType', {
    header: 'סוג דדליין',
    cell: (info) => <DeadlineBadge $type={info.getValue()}>{info.getValue()}</DeadlineBadge>,
  }),
  columnHelper.accessor('dueDate', {
    header: 'תאריך יעד',
    cell: (info) => info.getValue().toLocaleDateString('he-IL'),
  }),
  columnHelper.accessor('flagged', {
    header: 'מוסמנת',
    cell: (info) => (info.getValue() ? '🚩' : '—'),
  }),
  columnHelper.accessor('assigneeStatuses', {
    header: 'ממוינים',
    cell: (info) => info.getValue()?.length ?? 0,
  }),
]

function TasksLayout() {
  const { view } = Route.useSearch()
  const navigate = useNavigate()

  const table = useReactTable({
    data: MOCK_TASKS,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  function handleSetTable() {
    navigate({ search: (prev) => ({ ...prev, view: 'table' as ViewMode }) })
  }

  function handleSetCards() {
    navigate({ search: (prev) => ({ ...prev, view: 'cards' as ViewMode }) })
  }

  return (
    <>
      <TasksRoot>
        <Toolbar>
          <ViewSwitcher>
            <SwitcherButton $active={view === 'table'} onClick={handleSetTable} title="תצוגת טבלה">
              <Table2 size={16} />
            </SwitcherButton>
            <SwitcherButton $active={view === 'cards'} onClick={handleSetCards} title="תצוגת כרטיסיות">
              <LayoutGrid size={16} />
            </SwitcherButton>
          </ViewSwitcher>
        </Toolbar>

        {view === 'table' ? (
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <CardGrid>
            {MOCK_TASKS.map((task) => (
              <Card key={task.id}>
                <CardHeader>
                  <CardTitle>
                    <CardTitleRow>
                      {task.title}
                      {task.flagged && <span>🚩</span>}
                    </CardTitleRow>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescText>{task.description}</CardDescText>
                </CardContent>
                <CardFooter>
                  <DeadlineBadge $type={task.deadlineType}>{task.deadlineType}</DeadlineBadge>
                  <CardDateText>{task.dueDate.toLocaleDateString('he-IL')}</CardDateText>
                </CardFooter>
              </Card>
            ))}
          </CardGrid>
        )}
      </TasksRoot>
      <Outlet />
    </>
  )
}

const TasksRoot = styled.div`
  padding-block: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`

const Toolbar = styled.div`
  display: flex;
  align-items: center;
`

const ViewSwitcher = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
  background: var(--chip-bg);
  border: 1px solid var(--chip-line);
  border-radius: 8px;
  padding: 3px;
`

const SwitcherButton = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 6px;
  cursor: pointer;
  color: ${({ $active }) => $active ? 'var(--sea-ink)' : 'var(--sea-ink-soft)'};
  background: ${({ $active }) => $active ? 'var(--link-bg-hover)' : 'transparent'};
  transition: background 0.15s, color 0.15s;

  &:hover {
    background: var(--link-bg-hover);
    color: var(--sea-ink);
  }
`

const DeadlineBadge = styled.span<{ $type: string }>`
  display: inline-block;
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 500;
  background: var(--chip-bg);
  border: 1px solid var(--chip-line);
  color: var(--sea-ink-soft);
`

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

const CardDescText = styled.p`
  font-size: 13px;
  color: var(--sea-ink-soft);
  margin: 0;
`

const CardDateText = styled.span`
  font-size: 12px;
  color: var(--sea-ink-soft);
  margin-inline-start: auto;
`
