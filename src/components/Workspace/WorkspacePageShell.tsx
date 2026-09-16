import { readLocalStorageValue } from "@mantine/hooks"
import { useNavigate } from "@tanstack/react-router"
import { type PropsWithChildren, useEffect } from "react"
import { useGetMyPermission } from "src/api/permission/permission"
import { useWorkspace } from "src/providers/WorkspaceProvider"
import { PageShell } from "../shared/PageShell"

interface WorkspacePageShellProps extends PropsWithChildren {
	workspaceId: number
}
const FIRST_VISIT_STORAGE_KEY = "managerVisitFirstTime"

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
		key: FIRST_VISIT_STORAGE_KEY,
	})

	useEffect(() => {
		if (readLocalStorageValue({ key: FIRST_VISIT_STORAGE_KEY }) === undefined) {
			localStorage.setItem(FIRST_VISIT_STORAGE_KEY, "true")
		}
	}, [])

	useEffect(() => {
		if (!(isFetched && myPermission)) {
			return
		}

		const isManager = myPermission?.type === "MANAGER"
		if (needsAssigneesRedirect && isManager) {
			localStorage.setItem(FIRST_VISIT_STORAGE_KEY, "false")
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
