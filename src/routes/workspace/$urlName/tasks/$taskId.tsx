import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router"
import { useToggle } from "@mantine/hooks"
import { useGetTask } from "src/api/task/task"
import CreateTaskModal from "../../../../components/CreateTasks/CreateTaskModal"
import TaskDetailPanel from "../../../../components/TaskDetail/TaskDetailPanel"

export const Route = createFileRoute("/workspace/$urlName/tasks/$taskId")({
	component: TaskDetail,
})

function TaskDetail() {
	const { urlName, taskId } = Route.useParams()
	const { view } = useSearch({ from: "/workspace/$urlName/tasks" })
	const navigate = useNavigate()

	const { data: task } = useGetTask({ id: Number(taskId) })
	const [isEditing, toggleEditing] = useToggle()

	function handleClose() {
		navigate({
			to: "/workspace/$urlName/tasks",
			params: { urlName },
			search: { view },
		})
	}

	function handleDelete() {
		// if (task) {
		// 	removeTasks([task.id]);
		// }
		handleClose()
	}

	function handleEdit() {
		toggleEditing()
	}

	function handleEditClose() {
		toggleEditing()
	}

	if (!task) return null

	return isEditing ? (
		<CreateTaskModal task={task} onClose={handleEditClose} />
	) : (
		<TaskDetailPanel
			task={task}
			onClose={handleClose}
			onDelete={handleDelete}
			onEdit={handleEdit}
		/>
	)
}
