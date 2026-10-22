import { createFileRoute, useSearch } from "@tanstack/react-router"
import { MobileViewTaskDetail } from "src/components/Mobile/task/MobileViewTaskDetail"
import { useIsMobile } from "src/hooks/use-mobile"
import { useTaskDetail } from "src/hooks/useTaskDetail"
import { useWorkspaceMismatchError } from "src/hooks/useWorkspaceMismatchError"
import { useWorkspace } from "src/providers/WorkspaceProvider"
import TaskDetailView from "../../../../../components/TaskDetail/TaskDetailView"

export const Route = createFileRoute("/workspace/$urlName/tasks/$taskId/")({
	component: TaskDetail,
})

function TaskDetail() {
	const isMobile = useIsMobile()
	const { taskId } = Route.useParams()
	const { view } = useSearch({ from: "/workspace/$urlName/tasks" })

	const {
		workspace: { urlName },
	} = useWorkspace()

	const { task, isFetched } = useTaskDetail(taskId)

	useWorkspaceMismatchError(isFetched, task)

	return isMobile ? (
		<MobileViewTaskDetail task={task} />
	) : (
		<TaskDetailView
			task={task}
			closeTo={{
				to: "/workspace/$urlName/tasks",
				params: { urlName },
				search: { view },
			}}
			editTo={{
				to: "/workspace/$urlName/tasks/$taskId/edit",
				params: { urlName, taskId },
				search: { view },
			}}
		/>
	)
}
