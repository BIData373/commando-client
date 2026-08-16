import { createFileRoute } from "@tanstack/react-router"
import { useTaskDetail } from "src/hooks/useTaskDetail"
import { TasksView } from "src/routes/workspace/$urlName/tasks"
import TaskEditModal from "../../../../../components/CreateTasks/TaskEditModal"

export const Route = createFileRoute("/personal/tasks/task/$taskId/edit")({
	component: PersonalTaskEdit,
})

function PersonalTaskEdit() {
	const { taskId } = Route.useParams()

	const { task } = useTaskDetail(taskId)

	return (
		<TaskEditModal
			task={task}
			closeTo={{ to: "/personal/tasks", search: { view: TasksView.TABLE } }}
			viewTo={{
				to: "/personal/tasks/task/$taskId",
				params: { taskId },
				search: { view: TasksView.TABLE },
			}}
		/>
	)
}
