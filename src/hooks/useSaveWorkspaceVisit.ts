import { useLocation } from "@tanstack/react-router"
import { useEffect } from "react"
import {
	getListPersonalTaskRowsQueryKey,
	getListTaskRowsQueryKey,
} from "src/api/task/task"
import { upsertUserWorkspaceVisit } from "src/api/user-workspace-visits/user-workspace-visits"
import { invalidateQueries } from "src/query-client"

interface SaveWorkspaceVisitProps {
	workspaceId?: number
	urlName: string
}

export function useSaveWorkspaceVisit({
	workspaceId,
	urlName,
}: SaveWorkspaceVisitProps) {
	const location = useLocation()

	useEffect(() => {
		if (!location.pathname.includes(urlName)) {
			upsertUserWorkspaceVisit({ workspaceId })
			invalidateQueries([
				getListTaskRowsQueryKey(...(workspaceId ? [{ workspaceId }] : [])),
				getListPersonalTaskRowsQueryKey(),
			])
		}

		async function handleBeforeUnload() {
			await upsertUserWorkspaceVisit({ workspaceId })
		}
		window.addEventListener("beforeunload", handleBeforeUnload)
		return () => window.removeEventListener("beforeunload", handleBeforeUnload)
	}, [location.pathname, workspaceId, urlName])
}
