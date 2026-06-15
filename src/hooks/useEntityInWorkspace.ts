import { AxiosError } from "axios"
import { useMemo } from "react"
import { useErrorHandler } from "src/providers/ErrorModalProvider"
import { useWorkspace } from "src/providers/WorkspaceProvider"

interface IWorkspaceId {
	workspaceId: number
}

export function useEntityInWorkspace<T extends IWorkspaceId>(entity?: T) {
	const {
		workspace: { id: workspaceId },
	} = useWorkspace()

	const workspaceMismatchError = useMemo(
		() =>
			entity?.workspaceId && entity.workspaceId !== workspaceId
				? new AxiosError(undefined, "404")
				: null,
		[entity?.workspaceId, workspaceId],
	)

	useErrorHandler(workspaceMismatchError)
}
