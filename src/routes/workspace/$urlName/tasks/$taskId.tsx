import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router"
import { useState } from "react"
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
	const [isEditing, setIsEditing] = useState(false)

	function handleClose() {
		navigate({
			to: "/workspace/$urlName/tasks",
			params: { urlName },
			search: { view },
		})
	}

	function handleArchive() {
		// if (task) {
		// 	removeTasks([task.id]);
		// }
		handleClose()
	}

	function handleDelete() {
		// if (task) {
		// 	removeTasks([task.id]);
		// }
		handleClose()
	}

	function handleEdit() {
		setIsEditing(true)
	}

	function handleEditClose() {
		setIsEditing(false)
	}

	if (!task) return null

	if (isEditing) {
		return <CreateTaskModal task={task} onClose={handleEditClose} />
	}

	return (
		<TaskDetailPanel
			task={task}
			onClose={handleClose}
			onArchive={handleArchive}
			onDelete={handleDelete}
			onEdit={handleEdit}
		/>
	)
}
