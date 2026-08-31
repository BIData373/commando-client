import { createFileRoute } from "@tanstack/react-router"
import { PermissionType } from "src/api/model"
import { useTaskDetail } from "src/hooks/useTaskDetail"
import { TasksView } from "src/routes/workspace/$urlName/tasks"
import { AuthorizationWrapper } from "src/wrappers/AuthorizationWrapper"
import TaskEditModal from "../../../../components/CreateTasks/TaskEditModal"

export const Route = createFileRoute("/personal/task/$taskId/edit")({
	component: PersonalTaskEdit,
})

function PersonalTaskEdit() {
	const { taskId } = Route.useParams()

	const { task } = useTaskDetail(taskId)

	if (!task) return null

	return (
		<AuthorizationWrapper
			type={PermissionType.MANAGER}
			workspaceId={task.workspace.id}
		>
			<TaskEditModal
				task={task}
				closeTo={{ to: "/personal", search: { view: TasksView.TABLE } }}
				viewTo={{
					to: "/personal/task/$taskId",
					params: { taskId },
					search: { view: TasksView.TABLE },
				}}
			/>
		</AuthorizationWrapper>
	)
}
