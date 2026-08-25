import { createFileRoute, Outlet } from "@tanstack/react-router"
import { PermissionType } from "src/api/model"
import { ContentScrollArea } from "src/components/shared/ContentScrollArea"
import { PageShell } from "src/components/shared/PageShell"
import { WorkspaceTitle } from "src/components/WorkspaceTitle"
import { WorkspaceUserDropdown } from "src/components/WorkspaceUserDropdown"
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
	const { workspace } = useWorkspace()

	return (
		<UserViewProvider
			workspaceId={workspace.id}
			defaultColumnOrder={DEFAULT_COLUMN_ORDER}
			defaultHiddenColumns={WORKSPACE_DEFAULT_HIDDEN}
		>
			<AuthorizationWrapper type={PermissionType.VIEWER}>
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
