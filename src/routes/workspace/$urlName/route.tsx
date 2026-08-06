import { createFileRoute, Outlet } from "@tanstack/react-router"
import { PermissionType } from "src/api/model"
import { ContentScrollArea } from "src/components/shared/ContentScrollArea"
import { PageShell } from "src/components/shared/PageShell"
import { WorkspaceTabs } from "src/components/WorkspaceTabs"
import { WorkspaceTitle } from "src/components/WorkspaceTitle"
import { WorkspaceUserDropdown } from "src/components/WorkspaceUserDropdown"
import { WorkspaceProvider } from "src/providers/WorkspaceProvider"
import { AuthorizationWrapper } from "src/wrappers/AuthorizationWrapper"
import Header from "../../../components/Header"

export const Route = createFileRoute("/workspace/$urlName")({
	component: RouteComponent,
})

function RouteComponent() {
	return (
		<WorkspaceProvider>
			<AuthorizationWrapper type={PermissionType.VIEWER}>
				<PageShell>
					<Header />

					<WorkspaceUserDropdown />
					<WorkspaceTabs />
					<WorkspaceTitle />

					<ContentScrollArea>
						<Outlet />
					</ContentScrollArea>
				</PageShell>
			</AuthorizationWrapper>
		</WorkspaceProvider>
	)
}
