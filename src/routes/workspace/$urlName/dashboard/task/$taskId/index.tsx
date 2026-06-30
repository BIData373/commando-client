import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useGetTask } from "src/api/task/task"
import TaskDetailPanel from "../../../../../../components/TaskDetail/TaskDetailPanel"

export const Route = createFileRoute(
	"/workspace/$urlName/dashboard/task/$taskId/",
)({
	component: DashboardTaskDetail,
})

function DashboardTaskDetail() {
	const { urlName, taskId } = Route.useParams()
	const navigate = useNavigate()

	const { data: task } = useGetTask({ id: Number(taskId) })

	function handleClose() {
		navigate({ to: "/workspace/$urlName/dashboard", params: { urlName } })
	}

	function handleEdit() {
		navigate({
			to: "/workspace/$urlName/dashboard/task/$taskId/edit",
			params: { urlName, taskId },
		})
	}

	return (
		task && (
			<TaskDetailPanel task={task} onClose={handleClose} onEdit={handleEdit} />
		)
	)
}
