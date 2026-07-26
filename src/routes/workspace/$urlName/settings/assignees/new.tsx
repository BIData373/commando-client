import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { AssigneeDialog } from "src/components/settings/AssigneeDialog"
import { useWorkspace } from "src/providers/WorkspaceProvider"

export const Route = createFileRoute(
	"/workspace/$urlName/settings/assignees/new",
)({
	component: NewAssignee,
})

function NewAssignee() {
	const {
		workspace: { id: workspaceId, urlName },
	} = useWorkspace()

	const navigate = useNavigate()

	function handleClose() {
		navigate({
			to: "/workspace/$urlName/settings/assignees",
			params: { urlName },
		})
	}

	return (
		<AssigneeDialog workspaceId={workspaceId} open onOpenChange={handleClose} />
	)
}
