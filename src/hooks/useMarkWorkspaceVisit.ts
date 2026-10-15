import { useQueryClient } from "@tanstack/react-query"
import type { PermissionDto } from "src/api/model"
import {
	getGetMyPermissionQueryKey,
	useMarkMyWorkspaceVisit,
} from "src/api/permission/permission"

export function useMarkWorkspaceVisit(workspaceId: number) {
	const queryClient = useQueryClient()
	const { mutate } = useMarkMyWorkspaceVisit()

	function markWorkspaceVisit() {
		queryClient.setQueryData<PermissionDto>(
			getGetMyPermissionQueryKey({ workspaceId }),
			(permission) =>
				permission && { ...permission, hasEnteredWorkspace: true },
		)

		mutate({ params: { workspaceId } })
	}

	return markWorkspaceVisit
}
