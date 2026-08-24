import { useNavigate } from "@tanstack/react-router"
import type { DeadlineType, WorkspaceStatusType } from "src/api/model"
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
				onOpenTask={handleOpenTask}
				onEdit={handleEdit}
				clearColumnFilters={handleClearColumnFilters}
				onColumnFilterChange={handleColumnFiltersChange}
				deadlineTypeFilter={deadlineTypeFilter}
				statusFilter={statusFilter}
			/>
		</>
	)
}

export default TasksLayout
