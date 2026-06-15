import { useGetMyPermission } from "src/api/permission/permission"
import { useRenderInHeader } from "src/providers/HeaderProvider"
import { useWorkspace } from "src/providers/WorkspaceProvider"
import { UserDropdown } from "./UserDropdown"

export function WorkspaceUserDropdown() {
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
