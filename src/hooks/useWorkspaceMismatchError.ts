import { useMemo } from "react"
import { useErrorHandler } from "src/providers/ErrorModalProvider"
import { useWorkspace } from "src/providers/WorkspaceProvider"
import { ErrorCode } from "src/utils/error-utils"

interface IWorkspaceId {
	workspaceId: number
}

export function useWorkspaceMismatchError<T extends IWorkspaceId>(entity?: T) {
	const {
		workspace: { id: workspaceId },
	} = useWorkspace()

	const workspaceMismatchError = useMemo(
		() =>
			entity?.workspaceId && entity.workspaceId !== workspaceId
				? ErrorCode.NOT_FOUND
				: null,
		[entity?.workspaceId, workspaceId],
	)

	useErrorHandler(workspaceMismatchError)
}
