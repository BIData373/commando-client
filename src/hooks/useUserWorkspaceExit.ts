import { useEffect } from "react"
import { upsertUserWorkspaceVisit } from "src/api/user-workspace-entries/user-workspace-entries"

interface UpdateUserWorkspaceEntrie {
	workspaceId?: number
}

export function useUserWorkspaceEntrie({
	workspaceId,
}: UpdateUserWorkspaceEntrie) {
	useEffect(() => {
		async function handleBeforeUnload() {
			await upsertUserWorkspaceVisit({ workspaceId })
		}
		window.addEventListener("beforeunload", handleBeforeUnload)
		return () => window.removeEventListener("beforeunload", handleBeforeUnload)
	}, [workspaceId])
}
