import type { NavigateOptions, RegisteredRouter } from "@tanstack/react-router"
import { useNavigate } from "@tanstack/react-router"
import type { TaskWithWorkspaceDto } from "src/api/model"
import CreateTaskModal from "./CreateTaskModal"

interface TaskEditModalProps<
	TCloseTo extends string | undefined,
	TViewTo extends string | undefined,
> {
	task?: TaskWithWorkspaceDto
	closeTo: NavigateOptions<RegisteredRouter, string, TCloseTo>
	viewTo: NavigateOptions<RegisteredRouter, string, TViewTo>
}

function TaskEditModal<
	TCloseTo extends string | undefined,
	TViewTo extends string | undefined,
>({ task, closeTo, viewTo }: TaskEditModalProps<TCloseTo, TViewTo>) {
	const navigate = useNavigate()

	if (!task) {
		return null
	}

	return (
		<CreateTaskModal
			workspaceId={task.workspace.id}
			task={task}
			onClose={() => navigate(closeTo)}
			onSave={() => navigate(viewTo)}
			onCancel={() => navigate(viewTo)}
		/>
	)
}

export default TaskEditModal
