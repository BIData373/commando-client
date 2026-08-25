import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { NewWorkspaceModal } from "src/components/NewWorkspaceButton/NewWorkspaceModal"

export const Route = createFileRoute("/_home/new-workspace")({
	component: NewWorkspace,
})

function NewWorkspace() {
	const navigate = useNavigate()

	function handleClose() {
		navigate({ to: "/" })
	}

	return <NewWorkspaceModal onClose={handleClose} />
}
