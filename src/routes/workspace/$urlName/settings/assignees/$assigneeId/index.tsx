import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useGetAssignee } from "src/api/assignee/assignee"
import { AssigneeDialog } from "src/components/settings/AssigneeDialog"
import { useWorkspaceMismatchError } from "src/hooks/useWorkspaceMismatchError"
import { useWorkspace } from "src/providers/WorkspaceProvider"

export const Route = createFileRoute(
	"/workspace/$urlName/settings/assignees/$assigneeId/",
)({
	component: EditAssignee,
})

function EditAssignee() {
	const { assigneeId } = Route.useParams()

	const {
		workspace: { id: workspaceId, urlName },
	} = useWorkspace()

	const navigate = useNavigate()

	const { data: assignee, isFetched } = useGetAssignee({
		id: Number(assigneeId),
	})

	useWorkspaceMismatchError(isFetched, assignee)

	function handleClose() {
		navigate({
			to: "/workspace/$urlName/settings/assignees",
			params: { urlName },
		})
	}

	return (
		assignee && (
			<AssigneeDialog
				open
				workspaceId={workspaceId}
				assignee={assignee}
				onOpenChange={handleClose}
			/>
		)
	)
}
