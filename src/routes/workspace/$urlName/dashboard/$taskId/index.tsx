import { createFileRoute } from "@tanstack/react-router"
import { useTaskDetail } from "src/hooks/useTaskDetail"
import { useWorkspaceMismatchError } from "src/hooks/useWorkspaceMismatchError"
import TaskDetailView from "../../../../../components/TaskDetail/TaskDetailView"

export const Route = createFileRoute("/workspace/$urlName/dashboard/$taskId/")({
	component: DashboardTaskDetail,
})

function DashboardTaskDetail() {
	const { urlName, taskId } = Route.useParams()

	const { task, isFetched } = useTaskDetail(taskId)

	useWorkspaceMismatchError(isFetched, task)

	return (
		<TaskDetailView
			task={task}
			closeTo={{ to: "/workspace/$urlName/dashboard", params: { urlName } }}
			editTo={{
				to: "/workspace/$urlName/dashboard/$taskId/edit",
				params: { urlName, taskId },
			}}
		/>
	)
}
