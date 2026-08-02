import type { NavigateOptions, RegisteredRouter } from "@tanstack/react-router"
import { useNavigate } from "@tanstack/react-router"
import type { TaskDetailsDto } from "src/api/model"
import TaskDetailPanel from "./TaskDetailPanel"

interface TaskDetailViewProps<
	TCloseTo extends string | undefined,
	TEditTo extends string | undefined,
> {
	task?: TaskDetailsDto
	showWorkspace?: boolean
	closeTo: NavigateOptions<RegisteredRouter, string, TCloseTo>
	editTo: NavigateOptions<RegisteredRouter, string, TEditTo>
}

function TaskDetailView<
	TCloseTo extends string | undefined,
	TEditTo extends string | undefined,
>({
	task,
	showWorkspace,
	closeTo,
	editTo,
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
			onEdit={() => navigate(editTo)}
		/>
	)
}

export default TaskDetailView
