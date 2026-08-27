import { createFileRoute } from "@tanstack/react-router"
import { PermissionType } from "src/api/model"
import { useTaskDetail } from "src/hooks/useTaskDetail"
import { useWorkspace } from "src/providers/WorkspaceProvider"
import { AuthorizationWrapper } from "src/wrappers/AuthorizationWrapper"
import TaskEditModal from "../../../../../components/CreateTasks/TaskEditModal"

export const Route = createFileRoute(
	"/workspace/$urlName/dashboard/$taskId/edit",
)({
	component: DashboardTaskEdit,
})

function DashboardTaskEdit() {
	const { urlName, taskId } = Route.useParams()
	const { workspace } = useWorkspace()

	const { task } = useTaskDetail(taskId)

	return (
		<AuthorizationWrapper
			type={PermissionType.MANAGER}
			workspaceId={workspace.id}
		>
			<TaskEditModal
				task={task}
				closeTo={{ to: "/workspace/$urlName/dashboard", params: { urlName } }}
				viewTo={{
					to: "/workspace/$urlName/dashboard/$taskId",
					params: { urlName, taskId },
				}}
			/>
		</AuthorizationWrapper>
	)
}
