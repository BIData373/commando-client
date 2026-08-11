import { useNavigate } from "@tanstack/react-router"
import type {
	DeadlineType,
	QuickFilter,
	WorkspaceStatusType,
} from "src/api/model"
import {
	type TasksSearchSchemaType,
	TasksView,
} from "src/routes/workspace/$urlName/tasks"
import { useTasksFilters } from "../../providers/TasksFiltersProvider"
import { DropdownSection } from "../shared/ArchiveDropdown"
import { WorkspaceTabs } from "../WorkspaceTabs"
import WorkspaceTaskTable from "./WorkspaceTaskTable"

export interface TasksLayoutProps {
	view: TasksView
	urlName: string
	statusFilter: WorkspaceStatusType[]
	deadlineTypeFilter: DeadlineType[]
}

function TasksLayout({
	view = TasksView.TABLE,
	urlName,
	statusFilter = [],
	deadlineTypeFilter = [],
}: TasksLayoutProps) {
	const navigate = useNavigate()

	const { toggleQuickFilter } = useTasksFilters()
	const { columnOrder, hiddenColumns } = useTasksFilters()

	function navigateToTasks(taskFilter: Partial<TasksSearchSchemaType>) {
		navigate({
			to: "/workspace/$urlName/tasks",
			params: { urlName },
			search: {
				view,
				statusFilter,
				deadlineTypeFilter,
				...taskFilter,
			},
		})
	}

	function handleOpenTask(taskId: number) {
		navigate({
			to: "/workspace/$urlName/tasks/$taskId",
			params: { urlName, taskId: String(taskId) },
			search: { view: TasksView.TABLE },
		})
	}

	function handleEdit(taskId: number) {
		navigate({
			to: "/workspace/$urlName/tasks/$taskId/edit",
			params: { urlName, taskId: String(taskId) },
			search: { view },
		})
	}

	function handleToggleTabFilter(filter: QuickFilter) {
		toggleQuickFilter(filter)
		const next = tabFilter.includes(filter)
			? tabFilter.filter((f) => f !== filter)
			: [...tabFilter, filter]
		navigateToTasks({ tabFilter: next })
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

	function handleClearColumnFilters() {
		navigateToTasks({ statusFilter: [], deadlineTypeFilter: [] })
	}

	function handleClearQuickFilters() {
		navigateToTasks({ tabFilter: [] })
	}

	return (
		<>
			<WorkspaceTabs section={DropdownSection.TASKS} />
			<WorkspaceTaskTable
				onOpenTask={handleOpenTask}
				onEdit={handleEdit}
				clearColumnFilters={handleClearColumnFilters}
				clearQuickFilters={handleClearQuickFilters}
				onColumnFilterChange={handleColumnFiltersChange}
				toggleTabFilter={handleToggleTabFilter}
				deadlineTypeFilter={deadlineTypeFilter}
				tabFilter={tabFilter}
				statusFilter={statusFilter}
			/>
		</>
	)
}

export default TasksLayout
