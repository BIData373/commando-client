import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useGetTask } from "src/api/task/task"
import CreateTaskModal from "../../../../../../components/CreateTasks/CreateTaskModal"

export const Route = createFileRoute(
	"/workspace/$urlName/dashboard/task/$taskId/edit",
)({
	component: DashboardTaskEdit,
})

function DashboardTaskEdit() {
	const { urlName, taskId } = Route.useParams()
	const navigate = useNavigate()

	const { data: task } = useGetTask({ id: Number(taskId) })

	function handleClose() {
		navigate({ to: "/workspace/$urlName/dashboard", params: { urlName } })
	}

	if (!task) return null

	return (
		<CreateTaskModal
			workspaceId={task.workspace.id}
			task={task}
			onClose={handleClose}
		/>
	)
}
