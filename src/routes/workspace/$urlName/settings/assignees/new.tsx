import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { AssigneeDialog } from "src/components/settings/AssigneeDialog"

export const Route = createFileRoute(
	"/workspace/$urlName/settings/assignees/new",
)({
	component: NewAssignee,
})

function NewAssignee() {
	const { urlName } = Route.useParams()
	const navigate = useNavigate()

	function handleClose() {
		navigate({
			to: "/workspace/$urlName/settings/assignees",
			params: { urlName },
		})
	}

	return <AssigneeDialog open onOpenChange={handleClose} />
}
