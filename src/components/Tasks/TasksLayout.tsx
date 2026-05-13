import styled from '@emotion/styled'
import { Outlet, useNavigate } from '@tanstack/react-router'
import { ChevronDown, Plus } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '../ui/dropdown-menu'
import { TooltipProvider } from '../ui/tooltip'
import { type DirectiveStatus } from '../shared/StatusTag'
import { NoResultsFound } from './NoResultsFound'
import { TaskSearchBar } from './TaskSearchBar'
import { TaskFilters, type QuickFilter } from './TaskFilters'
import { TaskTable } from './TaskTable'
import { DEFAULT_COLUMN_ORDER } from './ColumnVisibilityDropdown'
import { TaskCardGrid } from './TaskCardGrid'
import { exportTasksToExcel } from '../../functions/export-excel'
import { applyAllFilters, buildFilterOptionsMap } from '../../functions/filter-utils'
import { useTitleBar } from '../../providers/TitleBarProvider'
import { useMemo, useState } from 'react'
import { useTasks } from '../../providers/TasksProvider'

export type View = 'TABLE' | 'CARDS'

interface TasksLayoutProps {
  view: View
  urlName: string
}

function TasksLayout({ view, urlName }: TasksLayoutProps) {
  const navigate = useNavigate()
  const { tasks, updateTaskStatus, removeTasks, bulkUpdateStatus } = useTasks()
  const [searchQuery, setSearchQuery] = useState('')
  const [activeQuickFilters, setActiveQuickFilters] = useState<Set<QuickFilter>>(new Set())
  const [activeTopicFilters, setActiveTopicFilters] = useState<Set<string>>(new Set())
  const [columnOrder, setColumnOrder] = useState(['serialNumber', ...DEFAULT_COLUMN_ORDER])
  const [hiddenColumns, setHiddenColumns] = useState<Set<string>>(new Set(['notes', 'updatedAt']))
  function handleToggleColumn(columnId: string) {
    setHiddenColumns((prev) => {
      const next = new Set(prev)
      if (next.has(columnId)) {
        next.delete(columnId)
      } else {
        next.add(columnId)
      }
      return next
    })
  }

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

  const filterOptionsMap = useMemo(() => buildFilterOptionsMap(tasks), [tasks])

  const filteredTasks = useMemo(
    () => applyAllFilters(tasks, activeQuickFilters, activeTopicFilters, searchQuery),
    [tasks, searchQuery, activeQuickFilters, activeTopicFilters],
  )

  function handleEdit(taskId: number) {
    navigate({ to: '/workspace/$urlName/tasks/$taskId', params: { urlName, taskId: String(taskId) }, search: { view } })
  }

  function handleArchive(taskIds: number[]) {
    removeTasks(taskIds)
  }

  function handleDelete(taskIds: number[]) {
    removeTasks(taskIds)
  }

  function handleExport() {
    exportTasksToExcel(filteredTasks, { columnOrder, hiddenColumns })
  }

  function handleBulkChangeStatus(taskIds: number[], status: DirectiveStatus) {
    bulkUpdateStatus(taskIds, status)
  }

  function handleCreateTaskFromDiscussion() {
    navigate({ to: '/workspace/$urlName/tasks/new', params: { urlName }, search: { view, mode: 'discussion'} })
  }

  function handleCreateTask() {
    navigate({ to: '/workspace/$urlName/tasks/new', params: { urlName }, search: { view, mode: 'single' } })
  }

  function handleViewChange(newView: View) {
    navigate({ to: '/workspace/$urlName/tasks', params: { urlName }, search: { view: newView } })
  }

  useTitleBar(
    () => (
      <ButtonGroup>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <CreateButton>
              <Plus size={18} color="white" />
              <CreateButtonText>צור הנחייה</CreateButtonText>
              <ChevronDown size={18} color="white" />
            </CreateButton>
          </DropdownMenuTrigger>
          <StyledDropdownContent align="end" sideOffset={6}>
            <StyledDropdownItem onSelect={handleCreateTaskFromDiscussion}>
              הנחיות מתוך דיון
            </StyledDropdownItem>
            <StyledDropdownItem onSelect={handleCreateTask}>
              הנחייה בודדת
            </StyledDropdownItem>
          </StyledDropdownContent>
        </DropdownMenu>
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
            columnOrder={columnOrder}
            hiddenColumns={hiddenColumns}
            onColumnOrderChange={setColumnOrder}
            onToggleColumn={handleToggleColumn}
          />
          <TaskFilters
            tasks={tasks}
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
            columnOrder={columnOrder}
            hiddenColumns={hiddenColumns}
            filterOptionsMap={filterOptionsMap}
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
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  cursor: pointer;
  white-space: nowrap;
  position: relative;
  outline: none;

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
  background: var(--colors-base-neutral-3);
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

// ─── Create Dropdown ─────────────────────────────────────────────────────────

const StyledDropdownContent = styled(DropdownMenuContent)`
  direction: rtl;
  min-width: var(--radix-dropdown-menu-trigger-width);
  padding: 4px;
  border-radius: 8px;
  box-shadow:
    0px 9px 28px 0px rgba(0, 0, 0, 0.05),
    0px 3px 6px -4px rgba(0, 0, 0, 0.12),
    0px 6px 16px 0px rgba(0, 0, 0, 0.08);
`

const StyledDropdownItem = styled(DropdownMenuItem)`
  direction: rtl;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  height: 32px;
  padding-inline: 12px;
  padding-block: 5px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  color: rgba(0, 0, 0, 0.88);
  white-space: nowrap;
  cursor: pointer;
`

// ─── Toolbar ──────────────────────────────────────────────────────────────────

const Toolbar = styled.div`
  direction: ltr;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 40px;
`
