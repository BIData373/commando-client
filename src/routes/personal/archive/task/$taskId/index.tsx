import { createFileRoute } from "@tanstack/react-router"
import { useTaskDetail } from "src/hooks/useTaskDetail"
import TaskDetailView from "../../../../../components/TaskDetail/TaskDetailView"

export const Route = createFileRoute("/personal/archive/task/$taskId/")({
	component: PersonalArchiveTaskDetail,
})

function PersonalArchiveTaskDetail() {
	const { taskId } = Route.useParams()
	const { task } = useTaskDetail(taskId)

	return (
		<TaskDetailView
			task={task}
			showWorkspace={true}
			closeTo={{ to: "/personal/archive" }}
			isArchived={true}
		/>
	)
}
