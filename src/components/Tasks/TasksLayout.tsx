import { useMemo, useState } from 'react'
import styled from '@emotion/styled'
import { Outlet, useNavigate } from '@tanstack/react-router'
import { ChevronDown, Plus } from 'lucide-react'
import { TooltipProvider } from '../ui/tooltip'
import { type DirectiveStatus } from './StatusCell'
import { NoResultsFound } from './NoResultsFound'
import { TaskSearchBar } from './TaskSearchBar'
import { TaskFilters, type QuickFilter } from './TaskFilters'
import { TaskTable } from './TaskTable'
import { TaskCardGrid } from './TaskCardGrid'
import { exportTasksToExcel } from '../../functions/exportExcel'
import { applyAllFilters } from '../../functions/filterUtils'
import { useTitleBar } from '../../providers/TitleBarProvider'
import { INITIAL_TASKS, type Task } from '../../data/Tasks'

export type View = 'TABLE' | 'CARDS'

interface TasksLayoutProps {
  view: View
  urlName: string
}

function TasksLayout({ view, urlName }: TasksLayoutProps) {
  const navigate = useNavigate()
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeQuickFilters, setActiveQuickFilters] = useState<Set<QuickFilter>>(new Set())
  const [activeTopicFilters, setActiveTopicFilters] = useState<Set<string>>(new Set())

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

  const filteredTasks = useMemo(
    () => applyAllFilters(tasks, activeQuickFilters, activeTopicFilters, searchQuery),
    [tasks, searchQuery, activeQuickFilters, activeTopicFilters],
  )

  function updateTaskStatus(taskId: number, status: DirectiveStatus) {
    setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, status, updatedAt: new Date() } : t)))
  }

  function handleEdit(taskId: number) {
    navigate({ to: '/workspace/$urlName/tasks/$taskId', params: { urlName, taskId: String(taskId) }, search: { view } })
  }

  function handleArchive(taskIds: number[]) {
    setTasks((prev) => prev.filter((t) => !taskIds.includes(t.id)))
  }

  function handleDelete(taskIds: number[]) {
    setTasks((prev) => prev.filter((t) => !taskIds.includes(t.id)))
  }

  function handleExport() {
    exportTasksToExcel(filteredTasks)
  }

  function handleBulkChangeStatus(taskIds: number[], status: DirectiveStatus) {
    setTasks((prev) =>
      prev.map((t) => (taskIds.includes(t.id) ? { ...t, status, updatedAt: new Date() } : t)),
    )
  }

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
          <TaskSearchBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onExport={handleExport}
          />
          <TaskFilters
            activeQuickFilters={activeQuickFilters}
            activeTopicFilters={activeTopicFilters}
            allTopics={allTopics}
            onToggleQuickFilter={toggleQuickFilter}
            onApplyTopicFilters={setActiveTopicFilters}
            onClearAllFilters={clearAllFilters}
          />
        </Toolbar>

        {tasks.length === 0 ? (
          <NoResultsFound variant="empty" />
        ) : searchQuery && filteredTasks.length === 0 ? (
          <NoResultsFound variant="no-search-results" />
        ) : view === 'TABLE' ? (
          <TaskTable
            tasks={filteredTasks}
            searchQuery={searchQuery}
            onUpdateStatus={updateTaskStatus}
            onEdit={handleEdit}
            onArchive={handleArchive}
            onDelete={handleDelete}
            onBulkChangeStatus={handleBulkChangeStatus}
          />
        ) : (
          <TaskCardGrid tasks={filteredTasks} />
        )}
      </TasksRoot>
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
