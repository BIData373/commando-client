import { createFileRoute, useNavigate } from "@tanstack/react-router"
import NoPermissionsModal from "src/components/Mobile/MobileHomePage/NoPermissionsModal"
import z from "zod"

export const noPermissionsSearchSchema = z.object({
	workspaceId: z.number(),
})

export const Route = createFileRoute("/_home/no-permissions")({
	validateSearch: noPermissionsSearchSchema,
	component: NoPermissions,
})

function NoPermissions() {
	const navigate = useNavigate()
	const { workspaceId } = Route.useSearch()

	function handleClose() {
		navigate({ to: "/" })
	}

	return <NoPermissionsModal onClose={handleClose} workspaceId={workspaceId} />
}
