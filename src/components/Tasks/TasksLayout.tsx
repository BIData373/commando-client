import styled from "@emotion/styled"
import { useNavigate } from "@tanstack/react-router"
import type { DeadlineType, WorkspaceStatusType } from "src/api/model"
import {
	type TasksSearchSchemaType,
	TasksView,
} from "src/routes/workspace/$urlName/tasks"
import type { QuickFilter } from "src/utils/filter-utils"
import { useTasksFilters } from "../../providers/TasksFiltersProvider"
import WorkspaceTaskTable from "./WorkspaceTaskTable"

export interface TasksLayoutProps {
	view: TasksView
	urlName: string
	tabFilter: QuickFilter[]
	statusFilter: WorkspaceStatusType[]
	deadlineTypeFilter: DeadlineType[]
}

function TasksLayout({
	view = TasksView.TABLE,
	urlName,
	tabFilter,
	statusFilter = [],
	deadlineTypeFilter = [],
}: TasksLayoutProps) {
	const navigate = useNavigate()

	const { toggleQuickFilter } = useTasksFilters()

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
	)
}

export default TasksLayout
