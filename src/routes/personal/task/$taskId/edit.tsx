import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useGetTask } from "src/api/task/task"
import { TasksView } from "src/routes/workspace/$urlName/tasks"
import CreateTaskModal from "../../../../components/CreateTasks/CreateTaskModal"

export const Route = createFileRoute("/personal/task/$taskId/edit")({
	component: PersonalTaskEdit,
})

function PersonalTaskEdit() {
	const { taskId } = Route.useParams()
	const navigate = useNavigate()

	const { data: task } = useGetTask({ id: Number(taskId) })

	function handleClose() {
		navigate({ to: "/personal", search: { view: TasksView.TABLE } })
	}

	function navigateView() {
		navigate({
			to: "/personal/task/$taskId",
			params: { taskId },
			search: { view: TasksView.TABLE },
		})
	}

	if (!task) {
		return null
	}

	return (
		<CreateTaskModal
			workspaceId={task.workspace.id}
			task={task}
			onClose={handleClose}
			onSave={navigateView}
			onCancel={navigateView}
		/>
	)
}
