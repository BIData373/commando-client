import { createFileRoute, Outlet, useLocation } from "@tanstack/react-router"
import { useEffect } from "react"
import { PermissionType } from "src/api/model"
import { updateUserEntrie } from "src/api/user-workspace-entries/user-workspace-entries"
import { ContentScrollArea } from "src/components/shared/ContentScrollArea"
import { PageShell } from "src/components/shared/PageShell"
import { WorkspaceTitle } from "src/components/WorkspaceTitle"
import { WorkspaceUserDropdown } from "src/components/WorkspaceUserDropdown"
import { useUserWorkspaceEntrie } from "src/hooks/useUserWorkspaceExit"
import { UserViewProvider } from "src/providers/UserViewProvider"
import {
	useWorkspace,
	WorkspaceProvider,
} from "src/providers/WorkspaceProvider"
import {
	DEFAULT_COLUMN_ORDER,
	WORKSPACE_DEFAULT_HIDDEN,
} from "src/utils/task-table-utils"
import { AuthorizationWrapper } from "src/wrappers/AuthorizationWrapper"
import Header from "../../../components/Header"

export const Route = createFileRoute("/workspace/$urlName")({
	component: RouteComponent,
})

function RouteComponent() {
	return (
		<WorkspaceProvider>
			<WorkspaceContent />
		</WorkspaceProvider>
	)
}

function WorkspaceContent() {
	const location = useLocation()
	const { workspace } = useWorkspace()

	useUserWorkspaceEntrie({ workspaceId: workspace.id })

	useEffect(() => {
		if (!location.pathname.includes(workspace.urlName)) {
			updateUserEntrie({ workspaceId: workspace.id })
		}
	}, [location.pathname])

	return (
		<UserViewProvider
			workspaceId={workspace.id}
			defaultColumnOrder={DEFAULT_COLUMN_ORDER}
			defaultHiddenColumns={WORKSPACE_DEFAULT_HIDDEN}
		>
			<AuthorizationWrapper
				type={PermissionType.VIEWER}
				workspaceId={workspace.id}
			>
				<PageShell>
					<Header />

					<WorkspaceUserDropdown />
					<WorkspaceTitle />

					<ContentScrollArea>
						<Outlet />
					</ContentScrollArea>
				</PageShell>
			</AuthorizationWrapper>
		</UserViewProvider>
	)
}
