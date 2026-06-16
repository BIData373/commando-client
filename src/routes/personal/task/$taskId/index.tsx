import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useGetTask } from "src/api/task/task"
import { TasksView } from "src/routes/workspace/$urlName/tasks"
import TaskDetailPanel from "../../../../components/TaskDetail/TaskDetailPanel"

export const Route = createFileRoute("/personal/task/$taskId/")({
	component: PersonalTaskDetail,
})

function PersonalTaskDetail() {
	const { taskId } = Route.useParams()
	const navigate = useNavigate()

	const { data: task } = useGetTask({ id: Number(taskId) })

	function handleClose() {
		navigate({ to: "/personal", search: { view: TasksView.TABLE } })
	}

	function handleEdit() {
		navigate({
			to: "/personal/task/$taskId/edit",
			params: { taskId },
			search: { view: TasksView.TABLE },
		})
	}

	return (
		task && (
			<TaskDetailPanel task={task} onClose={handleClose} onEdit={handleEdit} />
		)
	)
}
