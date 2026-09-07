import { useEffect } from "react"
import { updateUserEntrie } from "../api/user-workspace-entries/user-workspace-entries"

interface UpdateUserWorkspaceEntrie {
	workspaceId?: number
}

export function useUserWorkspaceEntrie({
	workspaceId,
}: UpdateUserWorkspaceEntrie) {
	useEffect(() => {
		function handleVisibilityChange() {
			if (document.visibilityState === "hidden") {
				updateUserEntrie({ workspaceId })
			}
		}
		document.addEventListener("visibilitychange", handleVisibilityChange)
		return () =>
			document.removeEventListener("visibilitychange", handleVisibilityChange)
	}, [])
}
