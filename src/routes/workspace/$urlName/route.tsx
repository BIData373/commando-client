import { createFileRoute, Outlet } from "@tanstack/react-router"
import { PermissionType } from "src/api/model"
import { WorkspaceHeader } from "src/components/WorkspaceHeader"
import { WorkspaceTabs } from "src/components/WorkspaceTabs"
import { WorkspaceProvider } from "src/providers/WorkspaceProvider"
import { AuthorizationWrapper } from "src/wrappers/AuthorizationWrapper"

export const Route = createFileRoute("/workspace/$urlName")({
	component: RouteComponent,
	staticData: {
		header: {
			user: true,
		},
	},
})

function RouteComponent() {
	return (
		<WorkspaceProvider>
			<AuthorizationWrapper type={PermissionType.VIEWER}>
				<WorkspaceTabs />
				<WorkspaceHeader />

				<Outlet />
			</AuthorizationWrapper>
		</WorkspaceProvider>
	)
}
