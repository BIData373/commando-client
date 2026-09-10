import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { AssigneesInfoModal } from "src/components/settings/AssigneesInfoModal"
import { useWorkspace } from "src/providers/WorkspaceProvider"

export const Route = createFileRoute(
	"/workspace/$urlName/settings/assignees/help",
)({
	component: AssigneesInfo,
})

function AssigneesInfo() {
	const {
		workspace: { urlName },
	} = useWorkspace()

	const navigate = useNavigate()

	function handleCloseModal() {
		navigate({
			to: "/workspace/$urlName/settings/assignees",
			params: { urlName },
		})
	}
	return <AssigneesInfoModal open onOpenChange={handleCloseModal} />
}
