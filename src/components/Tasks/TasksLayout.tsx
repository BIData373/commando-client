import styled from "@emotion/styled"
import { Outlet, useNavigate } from "@tanstack/react-router"
import { concat, uniq } from "lodash"
import { ChevronDown, Plus } from "lucide-react"
import { useMemo, useState } from "react"
import type { DeadlineType, WorkspaceStatusType } from "src/api/model"
import { useListTasks } from "src/api/task/task"
import { toTaskRows } from "src/functions/tasks-table"
import { useFilteredTasks } from "src/hooks/useFilteredTasks"
import { useWorkspace } from "src/providers/WorkspaceProvider"
import {
	type TasksSearchSchemaType,
	TasksView,
} from "src/routes/workspace/$urlName/tasks"
import { NewTaskMode } from "src/routes/workspace/$urlName/tasks/new"
import type { QuickFilter } from "src/utils/filter-utils"
import { exportTasksToExcel } from "../../functions/export-excel"
import { useTasksFilters } from "../../providers/TasksFiltersProvider"
import { useTitleBar } from "../../providers/TitleBarProvider"
import { MultiSelectFilterDropdown } from "../shared/MultiSelectFilterDropdown"
import { TasksDatePicker } from "../shared/TasksDatePicker/TasksDatePicker"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import { TooltipProvider } from "../ui/tooltip"
import { EmptyState } from "./EmptyState"
import { TaskCardGrid } from "./TaskCardGrid"
import { TaskFilters } from "./TaskFilters"
import { TaskTable } from "./TaskTable"
export { TasksView }

export interface TasksLayoutProps {
	view: TasksView
	urlName: string
	tabFilter: QuickFilter[]
	statusFilter: WorkspaceStatusType[]
	deadlineTypeFilter: DeadlineType[]
}

function TasksLayout({
	view,
	urlName,
	tabFilter,
	statusFilter,
	deadlineTypeFilter,
}: TasksLayoutProps) {
	const navigate = useNavigate({ from: "/workspace/$urlName/tasks" })

	const {
		searchQuery,
		columnOrder,
		hiddenColumns,
		dateRange,
		setDateRange,
		toggleQuickFilter,
		clearQuickFilters,
	} = useTasksFilters()

	const {
		workspace: { id: workspaceId },
	} = useWorkspace()

	const {
		data: tasks = [],
		queryKey,
		isLoading,
	} = useListTasks({ workspaceId })

	const [activeTopicFilters, setActiveTopicFilters] = useState<Set<string>>(
		new Set(),
	)

	const allTopics = uniq(
		tasks.flatMap((t) =>
			concat(t.tags, t.source?.tags ?? []).map((tag) => tag.name),
		),
	)

	const filteredTasks = useFilteredTasks(
		tasks,
		activeTopicFilters.size > 0
			? (task) => task.tags.some((tag) => activeTopicFilters.has(tag.name))
			: undefined,
	)

	const filteredTaskRows = useMemo(
		() => toTaskRows(filteredTasks),
		[filteredTasks],
	)

	const allTaskRows = useMemo(() => toTaskRows(tasks), [tasks])

	function navigateToTasks(taskFilter: Partial<TasksSearchSchemaType>) {
		navigate({
			to: "/workspace/$urlName/tasks",
			params: { urlName },
			search: {
				view,
				tabFilter,
				statusFilter,
				deadlineTypeFilter,
				...taskFilter,
			},
		})
	}

	function navigateWithMode(mode: NewTaskMode) {
		navigate({
			to: "/workspace/$urlName/tasks/new",
			params: { urlName },
			search: { view, mode },
		})
	}

	function handleOpenTask(taskId: number) {
		navigate({
			to: "/workspace/$urlName/tasks/$taskId",
			params: { urlName, taskId: String(taskId) },
			search: { view },
		})
	}

	function handleEdit(taskId: number) {
		navigate({
			to: "/workspace/$urlName/tasks/$taskId/edit",
			params: { urlName, taskId: String(taskId) },
			search: { view },
		})
	}

	function handleCreateTask() {
		navigateWithMode(NewTaskMode.SINGLE)
	}

	function handleCreateTaskFromDiscussion() {
		navigateWithMode(NewTaskMode.DISCUSSION)
	}

	function handleToggleTabFilter(filter: QuickFilter) {
		toggleQuickFilter(filter)
		const next = tabFilter.includes(filter)
			? tabFilter.filter((f) => f !== filter)
			: [...tabFilter, filter]
		navigate({ search: (prev) => ({ ...prev, tabFilter: next }) })
	}

	function clearAllFilters() {
		setActiveTopicFilters(new Set())
		setDateRange(undefined)
		clearQuickFilters()
		navigate({
			search: (prev) => ({
				...prev,
				tabFilter: [],
				statusFilter: [],
				deadlineTypeFilter: [],
			}),
		})
	}

	function handleColumnFiltersChange(
		newStatusFilter: WorkspaceStatusType[],
		newDeadlineTypeFilter: DeadlineType[],
	) {
		navigateToTasks({
			statusFilter: newStatusFilter,
			deadlineTypeFilter: newDeadlineTypeFilter,
		})
	}

	function handleExport() {
		exportTasksToExcel(filteredTaskRows, { columnOrder, hiddenColumns })
	}

	// function handleViewChange(newView: TasksView) {
	// 	navigateToTasks({ view: newView })
	// }

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
				{/* <SectionDivider />
				<ViewToggle view={view} onViewChange={handleViewChange} /> */}
			</ButtonGroup>
		),
		[view, urlName],
	)

	return (
		<TooltipProvider>
			<TasksRoot>
				<TaskFilters
					tasks={filteredTaskRows}
					allTasksLength={allTaskRows.length}
					onClearAllFilters={clearAllFilters}
					onExport={handleExport}
					tabFilter={tabFilter}
					onToggleTabFilter={handleToggleTabFilter}
					hasExtraActiveFilters={activeTopicFilters.size > 0 || !!dateRange}
					extraFilters={
						<MultiSelectFilterDropdown
							label="נושא"
							options={allTopics.map((t) => ({ value: t, label: t }))}
							activeValues={activeTopicFilters}
							onApply={setActiveTopicFilters}
							$active={activeTopicFilters.size > 0}
						/>
					}
					startSlot={<TasksDatePicker />}
				/>

				<ContentArea>
					{!isLoading && tasks.length === 0 ? (
						<EmptyState />
					) : searchQuery && filteredTasks.length === 0 ? (
						<EmptyState variant="search" />
					) : view === TasksView.TABLE ? (
						<TaskTable
							queryKey={queryKey}
							tasks={filteredTaskRows}
							onEdit={handleEdit}
							statusFilter={statusFilter}
							deadlineTypeFilter={deadlineTypeFilter}
							onFiltersChange={handleColumnFiltersChange}
							onDoubleClick={handleOpenTask}
						/>
					) : (
						<TaskCardGrid tasks={filteredTasks} />
					)}
				</ContentArea>
			</TasksRoot>
			<Outlet />
		</TooltipProvider>
	)
}

export default TasksLayout

// ─── Layout ───────────────────────────────────────────────────────────────────

const TasksRoot = styled.div`
  padding-block: 24px;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 28px;
  overflow: hidden;
`

const ContentArea = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  direction: ltr;
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
  font-size: var(--fs-base);
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
  font-size: var(--fs-btn);
  font-weight: 400;
  line-height: 22px;
  color: rgba(0, 0, 0, 0.88);
  white-space: nowrap;
  cursor: pointer;
`
