import { createFileRoute } from "@tanstack/react-router"
import { useTaskDetail } from "src/hooks/useTaskDetail"
import TaskEditModal from "../../../../../../components/CreateTasks/TaskEditModal"

export const Route = createFileRoute(
	"/workspace/$urlName/dashboard/task/$taskId/edit",
)({
	component: DashboardTaskEdit,
})

function DashboardTaskEdit() {
	const { urlName, taskId } = Route.useParams()

	const { task } = useTaskDetail(taskId)

	return (
		<TaskEditModal
			task={task}
			closeTo={{ to: "/workspace/$urlName/dashboard", params: { urlName } }}
			viewTo={{
				to: "/workspace/$urlName/dashboard/task/$taskId",
				params: { urlName, taskId },
			}}
		/>
	)
}
