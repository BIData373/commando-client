import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { AssigneesInfoModal } from "src/components/settings/AssigneesInfoModal"
import { useMarkWorkspaceVisit } from "src/hooks/useMarkWorkspaceVisit"
import { useWorkspace } from "src/providers/WorkspaceProvider"

export const Route = createFileRoute(
	"/workspace/$urlName/settings/assignees/help",
)({
	component: AssigneesInfo,
})

function AssigneesInfo() {
	const {
		workspace: { id: workspaceId, urlName },
	} = useWorkspace()

	const navigate = useNavigate()
	const markWorkspaceVisit = useMarkWorkspaceVisit(workspaceId)

	function handleCloseModal() {
		markWorkspaceVisit()
		navigate({
			to: "/workspace/$urlName/settings/assignees",
			params: { urlName },
		})
	}
	return <AssigneesInfoModal open onOpenChange={handleCloseModal} />
}
