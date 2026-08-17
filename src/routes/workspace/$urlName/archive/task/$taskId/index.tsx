import { createFileRoute } from "@tanstack/react-router"
import { useTaskDetail } from "src/hooks/useTaskDetail"
import { useWorkspace } from "src/providers/WorkspaceProvider"
import TaskDetailView from "../../../../../../components/TaskDetail/TaskDetailView"

export const Route = createFileRoute(
	"/workspace/$urlName/archive/task/$taskId/",
)({
	component: WorkspaceArchiveTaskDetail,
})

function WorkspaceArchiveTaskDetail() {
	const { taskId } = Route.useParams()
	const {
		workspace: { urlName },
	} = useWorkspace()
	const { task } = useTaskDetail(taskId)

	return (
		<TaskDetailView
			task={task}
			closeTo={{
				to: "/workspace/$urlName/archive",
				params: { urlName },
			}}
			isArchived={true}
		/>
	)
}
