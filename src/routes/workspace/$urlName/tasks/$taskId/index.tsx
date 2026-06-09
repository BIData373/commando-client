import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router"
import { useGetTask } from "src/api/task/task"
import TaskDetailPanel from "../../../../../components/TaskDetail/TaskDetailPanel"

export const Route = createFileRoute("/workspace/$urlName/tasks/$taskId/")({
	component: TaskDetail,
})

function TaskDetail() {
	const { urlName, taskId } = Route.useParams()
	const { view } = useSearch({ from: "/workspace/$urlName/tasks" })
	const navigate = useNavigate()

	const { data: task } = useGetTask({ id: Number(taskId) })

	function handleClose() {
		navigate({
			to: "/workspace/$urlName/tasks",
			params: { urlName },
			search: { view },
		})
	}

	function handleDelete() {
		handleClose()
	}

	function handleEdit() {
		navigate({
			to: "/workspace/$urlName/tasks/$taskId/edit",
			params: { urlName, taskId },
			search: { view },
		})
	}

	if (!task) return null

	return (
		<TaskDetailPanel
			task={task}
			onClose={handleClose}
			onDelete={handleDelete}
			onEdit={handleEdit}
		/>
	)
}
