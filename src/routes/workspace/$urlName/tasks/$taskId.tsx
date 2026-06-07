import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { z } from "zod"
import { useGetTask } from "src/api/task/task"
import CreateTaskModal from "../../../../components/CreateTasks/CreateTaskModal"
import TaskDetailPanel from "../../../../components/TaskDetail/TaskDetailPanel"
import { TasksView } from "../tasks"

export enum TaskDetailMode {
	VIEW = 'VIEW',
	EDIT = 'EDIT'
}

const TaskDetailSearchSchema = z.object({
	view: z.nativeEnum(TasksView).default(TasksView.TABLE),
	mode: z.nativeEnum(TaskDetailMode).default(TaskDetailMode.VIEW),
})

export const Route = createFileRoute("/workspace/$urlName/tasks/$taskId")({
	component: TaskDetail,
	validateSearch: TaskDetailSearchSchema,
})

function TaskDetail() {
	const { urlName, taskId } = Route.useParams()
	const { view, mode } = Route.useSearch()
	const navigate = useNavigate()

	const { data: task } = useGetTask({ id: Number(taskId) })

	function handleClose() {
		navigate({
			to: "/workspace/$urlName/tasks",
			params: { urlName },
			search: { view },
		})
	}

	function handleArchive() {
		handleClose()
	}

	function handleDelete() {
		handleClose()
	}

	if (!task) return null

	if (mode === TaskDetailMode.EDIT) {
		return <CreateTaskModal task={task} onClose={handleClose} />
	}

	return (
		<TaskDetailPanel
			task={task}
			onClose={handleClose}
			onArchive={handleArchive}
			onDelete={handleDelete}
		/>
	)
}
