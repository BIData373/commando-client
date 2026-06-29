import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useGetAssignee } from "src/api/assignee/assignee"
import { AssigneeDialog } from "src/components/settings/AssigneeDialog"
import { useWorkspaceMismatchError } from "src/hooks/useWorkspaceMismatchError"

export const Route = createFileRoute(
	"/workspace/$urlName/settings/assignees/$assigneeId/",
)({
	component: EditAssignee,
})

function EditAssignee() {
	const { urlName, assigneeId } = Route.useParams()
	const navigate = useNavigate()

	const { data: assignee } = useGetAssignee({ id: Number(assigneeId) })
	useWorkspaceMismatchError(assignee)

	function handleClose() {
		navigate({
			to: "/workspace/$urlName/settings/assignees",
			params: { urlName },
		})
	}

	return (
		assignee && (
			<AssigneeDialog open assignee={assignee} onOpenChange={handleClose} />
		)
	)
}
