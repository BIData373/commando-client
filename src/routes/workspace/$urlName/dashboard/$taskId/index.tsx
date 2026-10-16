import { createFileRoute } from "@tanstack/react-router"
import { MobileViewTaskDetail } from "src/components/Mobile/task/MobileViewTaskDetail"
import { useIsMobile } from "src/hooks/use-mobile"
import { useTaskDetail } from "src/hooks/useTaskDetail"
import { useWorkspaceMismatchError } from "src/hooks/useWorkspaceMismatchError"
import TaskDetailView from "../../../../../components/TaskDetail/TaskDetailView"

export const Route = createFileRoute("/workspace/$urlName/dashboard/$taskId/")({
	component: DashboardTaskDetail,
})

function DashboardTaskDetail() {
	const isMobile = useIsMobile()
	const { urlName, taskId } = Route.useParams()

	const { task, isFetched } = useTaskDetail(taskId)

	useWorkspaceMismatchError(isFetched, task)

	return isMobile ? (
		<MobileViewTaskDetail task={task} />
	) : (
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
