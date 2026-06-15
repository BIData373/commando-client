import { createFileRoute, Outlet } from "@tanstack/react-router"
import { PermissionType } from "src/api/model"
import { useGetMyPermission } from "src/api/permission/permission"
import { UserDropdown } from "src/components/UserDropdown"
import { WorkspaceTabs } from "src/components/WorkspaceTabs"
import { WorkspaceTitle } from "src/components/WorkspaceTitle"
import { useRenderInHeader } from "src/providers/HeaderProvider"
import {
	useWorkspace,
	WorkspaceProvider,
} from "src/providers/WorkspaceProvider"
import { AuthorizationWrapper } from "src/wrappers/AuthorizationWrapper"

export const Route = createFileRoute("/workspace/$urlName")({
	component: RouteComponent,
	staticData: {
		header: {
			user: true,
		},
	},
})

function UserDropdownWithWorkspace() {
	const {
		workspace: { id: workspaceId },
	} = useWorkspace()

	const { data: myPermission } = useGetMyPermission({ workspaceId })

	useRenderInHeader(
		"user",
		<UserDropdown
			permissionType={myPermission?.type}
			showPersonalArea={true}
		/>,
		[myPermission?.type],
	)

	return null
}

function RouteComponent() {
	return (
		<WorkspaceProvider>
			<AuthorizationWrapper type={PermissionType.VIEWER}>
				<UserDropdownWithWorkspace />
				<WorkspaceTabs />
				<WorkspaceTitle />

				<Outlet />
			</AuthorizationWrapper>
		</WorkspaceProvider>
	)
}
