import { useMemo, useState } from 'react'
import styled from '@emotion/styled'
import { TooltipProvider } from '../ui/tooltip'
import { MetricsBar } from './MetricsBar'
import { PersonalTaskTable } from './PersonalTaskTable'
import { MultiSelectFilterDropdown } from '../shared/MultiSelectFilterDropdown'
import { TaskFilters, type QuickFilter } from '../Tasks/TaskFilters'
import { NoResultsFound } from '../Tasks/NoResultsFound'
import { useTitleBar } from '../../providers/TitleBarProvider'
import { PERSONAL_TASKS, type PersonalTask, type Workspace } from '../../data/PersonalTasks'
import { applyAllFilters, buildFilterOptionsMap } from '../../functions/filter-utils'
import { TaskColumnId } from '../../hooks/useTaskColumns'
import type { DirectiveStatus } from '../shared/StatusTag'
import { isThisWeek } from 'date-fns'
import type { TasksLayoutProps, View } from '../Tasks/TasksLayout'

const PERSONAL_DEFAULT_COLUMN_ORDER = [
  TaskColumnId.Title,
  TaskColumnId.Status,
  TaskColumnId.Responsible,
  TaskColumnId.DeadlineType,
  TaskColumnId.DiscussionName,
  TaskColumnId.Notes,
  'workspace',
  TaskColumnId.CreatedAt,
]

const PERSONAL_DEFAULT_HIDDEN = new Set(['notes'])

function PersonalTasksLayout({ view, urlName }: TasksLayoutProps) {
  const [tasks, setTasks] = useState<PersonalTask[]>(PERSONAL_TASKS)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeQuickFilters, setActiveQuickFilters] = useState<Set<QuickFilter>>(new Set())
  const [activeWorkspaceFilters, setActiveWorkspaceFilters] = useState<Set<number>>(new Set())
  const [columnOrder, setColumnOrder] = useState([TaskColumnId.SerialNumber, ...PERSONAL_DEFAULT_COLUMN_ORDER])
  const [hiddenColumns, setHiddenColumns] = useState<Set<string>>(new Set(PERSONAL_DEFAULT_HIDDEN))

  const workspaces = useMemo(() => {
    const map = new Map<number, Workspace>()
    tasks.forEach((t) => map.set(t.workspace.id, t.workspace))
    return [...map.values()]
  }, [tasks])

  const totalCount = tasks.length
  const notStartedCount = tasks.filter((t) => t.status === 'not_started').length
  const inProgressCount = tasks.filter((t) => t.status === 'in_progress').length
  const weeklyNew = tasks.filter((t) => isThisWeek(t.createdAt, { weekStartsOn: 0 })).length

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
    setActiveWorkspaceFilters(new Set())
  }

  const filterOptionsMap = useMemo(() => buildFilterOptionsMap(tasks), [tasks])

  const filteredTasks = useMemo(() => {
    let result = applyAllFilters(tasks, activeQuickFilters, new Set(), searchQuery) as PersonalTask[]

    if (activeWorkspaceFilters.size > 0) {
      result = result.filter((t) => activeWorkspaceFilters.has(t.workspace.id))
    }

    return result
  }, [tasks, searchQuery, activeQuickFilters, activeWorkspaceFilters])

  function handleUpdateStatus(taskId: number, status: DirectiveStatus) {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status, updatedAt: new Date() } : t)),
    )
  }

  function handleBulkChangeStatus(taskIds: number[], status: DirectiveStatus) {
    setTasks((prev) =>
      prev.map((t) => (taskIds.includes(t.id) ? { ...t, status, updatedAt: new Date() } : t)),
    )
  }

  function handleArchive(taskIds: number[]) {
    setTasks((prev) => prev.filter((t) => !taskIds.includes(t.id)))
  }

  function handleDelete(taskIds: number[]) {
    setTasks((prev) => prev.filter((t) => !taskIds.includes(t.id)))
  }

  function handleExport() {
    // placeholder for export
  }
  
  function handleViewChange(newView: View) {
    return newView;
    // placeholder for view change
  }

  useTitleBar(
    () => (
        <SegmentedControl>
          <SegmentedItem
            $selected={view === 'TABLE'}
            onClick={() => handleViewChange('TABLE')}
          >
            טבלה
          </SegmentedItem>
          <SegmentedItem
            $selected={view === 'CARDS'}
            onClick={() => handleViewChange('CARDS')}
          >
            כרטיסיות
          </SegmentedItem>
        </SegmentedControl>
    ),
    [view, urlName],
  )

  return (
    <TooltipProvider>
      <PageRoot>
        <MetricsBar
          totalCount={totalCount}
          notStartedCount={notStartedCount}
          inProgressCount={inProgressCount}
          weeklyNew={weeklyNew}
        />

        <TaskFilters
          tasks={tasks}
          activeQuickFilters={activeQuickFilters}
          activeTopicFilters={new Set<string>()}
          onToggleQuickFilter={toggleQuickFilter}
          onClearAllFilters={clearAllFilters}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onExport={handleExport}
          columnOrder={columnOrder}
          hiddenColumns={hiddenColumns}
          onColumnOrderChange={setColumnOrder}
          onToggleColumn={handleToggleColumn}
          hasExtraActiveFilters={activeWorkspaceFilters.size > 0}
          extraFilters={
            <MultiSelectFilterDropdown
              label={activeWorkspaceFilters.size > 0 ? `סביבות (${activeWorkspaceFilters.size})` : 'כל הסביבות'}
              options={workspaces.map((ws) => ({
                value: ws.id,
                label: ws.name,
                icon: <WorkspaceIcon src={ws.iconUrl} alt={ws.name} />,
              }))}
              activeValues={activeWorkspaceFilters}
              onApply={setActiveWorkspaceFilters}
              $active={activeWorkspaceFilters.size > 0}
            />
          }
        />

        {tasks.length === 0 ? (
          <NoResultsFound variant="empty" />
        ) : searchQuery && filteredTasks.length === 0 ? (
          <NoResultsFound variant="no-search-results" />
        ) : (
          <PersonalTaskTable
            tasks={filteredTasks}
            searchQuery={searchQuery}
            columnOrder={columnOrder}
            hiddenColumns={hiddenColumns}
            filterOptionsMap={filterOptionsMap}
            onUpdateStatus={handleUpdateStatus}
            onBulkChangeStatus={handleBulkChangeStatus}
            onArchive={handleArchive}
            onDelete={handleDelete}
          />
        )}
      </PageRoot>
    </TooltipProvider>
  )
}

export default PersonalTasksLayout

const PageRoot = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 32px;
  gap: 28px;
  height: 100%;
  overflow: hidden;
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


const WorkspaceIcon = styled.img`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  object-fit: cover;
`
