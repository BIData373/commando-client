import { useNavigate } from "@tanstack/react-router"
import type { DeadlineType, WorkspaceStatusType } from "src/api/model"
import { useOpenTask } from "src/hooks/useOpenTask"
import {
	type TasksSearchSchemaType,
	TasksView,
} from "src/routes/workspace/$urlName/tasks"
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
	const { openTask, editTask } = useOpenTask(
		"/workspace/$urlName/tasks/$taskId",
	)

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
		navigateToTasks({
			statusFilter: [],
			deadlineTypeFilter: [],
		})
	}

	return (
		<>
			<WorkspaceTabs section={DropdownSection.TASKS} />
			<WorkspaceTaskTable
				urlName={urlName}
				onOpenTask={openTask}
				onEdit={editTask}
				clearColumnFilters={handleClearColumnFilters}
				onColumnFilterChange={handleColumnFiltersChange}
				deadlineTypeFilter={deadlineTypeFilter}
				statusFilter={statusFilter}
			/>
		</>
	)
}

export default TasksLayout
