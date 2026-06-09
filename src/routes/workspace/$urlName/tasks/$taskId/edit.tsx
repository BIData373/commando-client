import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router"
import { useGetTask } from "src/api/task/task"
import CreateTaskModal from "../../../../../components/CreateTasks/CreateTaskModal"

export const Route = createFileRoute("/workspace/$urlName/tasks/$taskId/edit")({
	component: TaskEdit,
})

function TaskEdit() {
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

	if (!task) {
		return null
	}

	return <CreateTaskModal task={task} onClose={handleClose} />
}
