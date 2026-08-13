import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { NewWorkspaceModal } from "src/components/NewWorkspace/NewWorkspaceModal"
import { Dialog } from "src/components/ui/dialog"

export const Route = createFileRoute("/new-workspace")({
	component: NewWorkspace,
})

function NewWorkspace() {
	const navigate = useNavigate()

	function handleClose() {
		navigate({ to: "/" })
	}

	return (
		<Dialog open onOpenChange={handleClose}>
			<NewWorkspaceModal onClose={handleClose} />
		</Dialog>
	)
}
