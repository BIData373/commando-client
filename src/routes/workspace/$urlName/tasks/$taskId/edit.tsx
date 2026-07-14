import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router"
import { PermissionType } from "src/api/model"
import { useGetTask } from "src/api/task/task"
import { AuthorizationWrapper } from "src/wrappers/AuthorizationWrapper"
import CreateTaskModal from "../../../../../components/CreateTasks/CreateTaskModal"

export const Route = createFileRoute("/workspace/$urlName/tasks/$taskId/edit")({
	component: TaskEdit,
})

function TaskEdit() {
	const { urlName, taskId } = Route.useParams()
	const { view } = useSearch({ from: "/workspace/$urlName/tasks" })
	const navigate = useNavigate()

	const { data: task } = useGetTask({ id: Number(taskId) })

	function handleClose() {
		navigate({
			to: "/workspace/$urlName/tasks",
			params: { urlName },
			search: { view },
		})
	}

	function navigateView() {
		navigate({
			to: "/workspace/$urlName/tasks/$taskId",
			params: { urlName, taskId },
			search: { view },
		})
	}

	if (!task) {
		return null
	}

	return (
		<AuthorizationWrapper type={PermissionType.MANAGER}>
			<CreateTaskModal
				workspaceId={task.workspace.id}
				task={task}
				onClose={handleClose}
				onSave={navigateView}
				onCancel={navigateView}
			/>
		</AuthorizationWrapper>
	)
}
