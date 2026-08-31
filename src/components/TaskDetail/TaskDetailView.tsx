import type { NavigateOptions, RegisteredRouter } from "@tanstack/react-router"
import { useNavigate } from "@tanstack/react-router"
import type { TaskWithWorkspaceDto } from "src/api/model"
import TaskDetailPanel from "./TaskDetailPanel"

interface TaskDetailViewProps<
	TCloseTo extends string | undefined,
	TEditTo extends string | undefined,
> {
	task?: TaskWithWorkspaceDto
	showWorkspace?: boolean
	closeTo: NavigateOptions<RegisteredRouter, string, TCloseTo>
	editTo?: NavigateOptions<RegisteredRouter, string, TEditTo>
	isArchived?: boolean
	isPersonal?: boolean
}

function TaskDetailView<
	TCloseTo extends string | undefined,
	TEditTo extends string | undefined,
>({
	task,
	showWorkspace,
	closeTo,
	editTo,
	isArchived = false,
	isPersonal = false,
}: TaskDetailViewProps<TCloseTo, TEditTo>) {
	const navigate = useNavigate()

	if (!task) {
		return null
	}

	return (
		<TaskDetailPanel
			task={task}
			showWorkspace={showWorkspace}
			onClose={() => navigate(closeTo)}
			onEdit={editTo ? () => navigate(editTo) : undefined}
			isArchived={isArchived}
			isPersonal={isPersonal}
		/>
	)
}

export default TaskDetailView
