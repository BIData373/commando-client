import { useNavigate } from "@tanstack/react-router"
import { type PropsWithChildren, useEffect } from "react"
import { PermissionType } from "src/api/model"
import { useGetMyPermission } from "src/api/permission/permission"
import { useWorkspace } from "src/providers/WorkspaceProvider"
import { PageShell } from "../shared/PageShell"

interface WorkspacePageShellProps extends PropsWithChildren {
	workspaceId: number
}

export function WorkspacePageShell({
	workspaceId,
	children,
}: WorkspacePageShellProps) {
	const { data: myPermission, isFetched: isPermissionFetched } =
		useGetMyPermission({
			workspaceId,
		})
	const {
		workspace: { urlName },
	} = useWorkspace()
	const navigate = useNavigate()

	useEffect(() => {
		if (!isPermissionFetched) {
			return
		}

		const isManager = myPermission?.type === PermissionType.MANAGER

		if (!myPermission?.hasEnteredWorkspace && isManager) {
			navigate({
				to: "/workspace/$urlName/settings/assignees/help",
				params: { urlName },
			})
		}
	}, [myPermission, isPermissionFetched, navigate, urlName])

	return <PageShell>{children}</PageShell>
}
