import { createFileRoute, Outlet } from "@tanstack/react-router"
import { PermissionType } from "src/api/model"
import { WorkspaceProvider } from "src/providers/WorkspaceProvider"
import { AuthorizationWrapper } from "src/wrappers/AuthorizationWrapper"

export const Route = createFileRoute("/workspace/$urlName")({
	component: RouteComponent,
	staticData: {
		header: {
			user: true,
			navigation: true,
			workspace: true,
		},
	},
})

function RouteComponent() {
	return (
		<WorkspaceProvider>
			<AuthorizationWrapper type={PermissionType.VIEWER}>
				<Outlet />
			</AuthorizationWrapper>
		</WorkspaceProvider>
	)
}
