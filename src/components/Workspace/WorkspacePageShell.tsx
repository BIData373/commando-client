import { readLocalStorageValue } from "@mantine/hooks"
import { useNavigate } from "@tanstack/react-router"
import type React from "react"
import { useEffect } from "react"
import { useGetMyPermission } from "src/api/permission/permission"
import { useWorkspace } from "src/providers/WorkspaceProvider"
import { PageShell } from "../shared/PageShell"

interface WorkspacePageShellProps extends React.PropsWithChildren {
	workspaceId: number
}
const LOCAL_STORAGE_KEY = "managerVisitFirstTime"
if (readLocalStorageValue({ key: LOCAL_STORAGE_KEY }) === undefined)
	localStorage.setItem(LOCAL_STORAGE_KEY, "true")

export function WorkspacePageShell({
	workspaceId,
	children,
}: WorkspacePageShellProps) {
	const { data: myPermission, isFetched } = useGetMyPermission({
		workspaceId,
	})
	const {
		workspace: { urlName },
	} = useWorkspace()
	const navigate = useNavigate()
	const needsAssigneesRedirect = readLocalStorageValue({
		key: LOCAL_STORAGE_KEY,
	})

	useEffect(() => {
		if (!isFetched || !myPermission) return

		console.log(myPermission?.type)

		const isManager = myPermission?.type === "MANAGER"
		if (needsAssigneesRedirect && isManager) {
			localStorage.setItem(LOCAL_STORAGE_KEY, "false")
			navigate({
				to: "/workspace/$urlName/settings/assignees/help",
				params: { urlName },
			})
		} else {
			navigate({
				to: "/workspace/$urlName/dashboard",
				params: { urlName },
			})
		}
	}, [myPermission, isFetched, navigate, urlName, needsAssigneesRedirect])

	return <PageShell>{children}</PageShell>
}
