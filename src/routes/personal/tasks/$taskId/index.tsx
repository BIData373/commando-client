import { createFileRoute } from "@tanstack/react-router"
import { useTaskDetail } from "src/hooks/useTaskDetail"
import TaskDetailView from "../../../../components/TaskDetail/TaskDetailView"

export const Route = createFileRoute("/personal/tasks/$taskId/")({
	component: PersonalTaskDetail,
})

function PersonalTaskDetail() {
	const { taskId } = Route.useParams()

	const { task } = useTaskDetail(taskId)

	return (
		<TaskDetailView
			task={task}
			showWorkspace={true}
			closeTo={{ to: "/personal/tasks" }}
			editTo={{
				to: "/personal/tasks/$taskId/edit",
				params: { taskId },
			}}
			isPersonal
		/>
	)
}
