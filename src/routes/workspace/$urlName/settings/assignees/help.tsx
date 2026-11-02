import { createFileRoute, useNavigate } from "@tanstack/react-router"
import type { WorkspaceWithPermissionDto } from "src/api/model"
import { useUpsertUserWorkspaceVisit } from "src/api/user-workspace-visits/user-workspace-visits"
import { getListWorkspacesQueryKey } from "src/api/workspace/workspace"
import { AssigneesInfoModal } from "src/components/settings/AssigneesInfoModal"
import { useWorkspace } from "src/providers/WorkspaceProvider"
import { queryClient } from "src/query-client"

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
	const { mutate: saveWorkspaceVisit } = useUpsertUserWorkspaceVisit()

	function handleCloseModal() {
		queryClient.setQueryData<WorkspaceWithPermissionDto[]>(
			getListWorkspacesQueryKey({ urlName }),
			(prev) => prev && prev.map((w) => ({ ...w, hasEnteredWorkspace: true })),
		)
		saveWorkspaceVisit({ params: { workspaceId } })

		navigate({
			to: "/workspace/$urlName/settings/assignees",
			params: { urlName },
		})
	}

	return <AssigneesInfoModal open onOpenChange={handleCloseModal} />
}
