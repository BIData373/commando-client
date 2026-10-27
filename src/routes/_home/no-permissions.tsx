import { createFileRoute, useNavigate } from "@tanstack/react-router"
import NoPermissionsModal, {
	noPermissionsSearchSchema,
} from "src/components/Mobile/MobileHomePage/NoPermissionsModal"

export const Route = createFileRoute("/_home/no-permissions")({
	validateSearch: noPermissionsSearchSchema,
	component: NoPermissions,
})

function NoPermissions() {
	const navigate = useNavigate()
	const { sourceId } = Route.useSearch()

	function handleClose() {
		navigate({ to: "/" })
	}

	return <NoPermissionsModal onClose={handleClose} sourceId={sourceId} />
}
