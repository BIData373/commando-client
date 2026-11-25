import { createFileRoute } from "@tanstack/react-router"
import { useTaskDetail } from "src/hooks/useTaskDetail"
import { useWorkspaceMismatchError } from "src/hooks/useWorkspaceMismatchError"
import { useWorkspace } from "src/providers/WorkspaceProvider"
import TaskDetailView from "../../../../../components/TaskDetail/TaskDetailView"

export const Route = createFileRoute("/workspace/$urlName/tasks/$taskId/")({
	component: TaskDetail,
})

function TaskDetail() {
	const { taskId } = Route.useParams()

	const {
		workspace: { urlName },
	} = useWorkspace()

	const { task, isFetched } = useTaskDetail(taskId)

	useWorkspaceMismatchError(isFetched, task)

	return (
		<TaskDetailView
			task={task}
			closeTo={{
				to: "/workspace/$urlName/tasks",
				params: { urlName },
			}}
			editTo={{
				to: "/workspace/$urlName/tasks/$taskId/edit",
				params: { urlName, taskId },
			}}
		/>
	)
}
