import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router"
import { useGetTask } from "src/api/task/task"
import { useWorkspaceMismatchError } from "src/hooks/useWorkspaceMismatchError"
import TaskDetailPanel from "../../../../../components/TaskDetail/TaskDetailPanel"

export const Route = createFileRoute("/workspace/$urlName/tasks/$taskId/")({
	component: TaskDetail,
})

function TaskDetail() {
	const { urlName, taskId } = Route.useParams()
	const { view } = useSearch({ from: "/workspace/$urlName/tasks" })
	const navigate = useNavigate()

	const { data: task } = useGetTask({ id: Number(taskId) })

	useWorkspaceMismatchError(task)

	function handleClose() {
		navigate({
			to: "/workspace/$urlName/tasks",
			params: { urlName },
			search: { view },
		})
	}

	function handleEdit() {
		navigate({
			to: "/workspace/$urlName/tasks/$taskId/edit",
			params: { urlName, taskId },
			search: { view },
		})
	}

	return (
		task && (
			<TaskDetailPanel task={task} onClose={handleClose} onEdit={handleEdit} />
		)
	)
}
