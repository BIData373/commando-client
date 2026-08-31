import { createFileRoute, useSearch } from "@tanstack/react-router"
import { PermissionType } from "src/api/model"
import { useTaskDetail } from "src/hooks/useTaskDetail"
import { useWorkspace } from "src/providers/WorkspaceProvider"
import { AuthorizationWrapper } from "src/wrappers/AuthorizationWrapper"
import TaskEditModal from "../../../../../components/CreateTasks/TaskEditModal"

export const Route = createFileRoute("/workspace/$urlName/tasks/$taskId/edit")({
	component: TaskEdit,
})

function TaskEdit() {
	const { urlName, taskId } = Route.useParams()
	const { view } = useSearch({ from: "/workspace/$urlName/tasks" })
	const { workspace } = useWorkspace()

	const { task } = useTaskDetail(taskId)

	return (
		<AuthorizationWrapper
			type={PermissionType.MANAGER}
			workspaceId={workspace.id}
		>
			<TaskEditModal
				task={task}
				closeTo={{
					to: "/workspace/$urlName/tasks",
					params: { urlName },
					search: { view },
				}}
				viewTo={{
					to: "/workspace/$urlName/tasks/$taskId",
					params: { urlName, taskId },
					search: { view },
				}}
			/>
		</AuthorizationWrapper>
	)
}
