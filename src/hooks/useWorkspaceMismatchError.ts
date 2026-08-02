import { useMemo } from "react"
import { useErrorHandler } from "src/providers/ErrorModalProvider"
import { useWorkspace } from "src/providers/WorkspaceProvider"
import { ErrorCode } from "src/utils/error-utils"

interface IWorkspaceId {
	workspaceId: number
}

export function useWorkspaceMismatchError<T extends IWorkspaceId>(
	isFetched: boolean,
	entity?: T,
) {
	const {
		workspace: { id: workspaceId },
	} = useWorkspace()

	const workspaceMismatchError = useMemo(
		() =>
			isFetched && (!entity || entity.workspaceId !== workspaceId)
				? ErrorCode.NOT_FOUND
				: null,
		[isFetched, entity, workspaceId],
	)

	useErrorHandler(workspaceMismatchError)
}
