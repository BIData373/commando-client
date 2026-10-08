import { useMemo } from "react"
import { useGetMyPermission } from "src/api/permission/permission"
import { useRenderInHeader } from "src/providers/HeaderProvider"
import { useWorkspace } from "src/providers/WorkspaceProvider"
import { UserDropdown } from "./UserDropdown"

export function WorkspaceUserDropdown() {
	const {
		workspace: { id: workspaceId },
	} = useWorkspace()

	const { data: myPermission } = useGetMyPermission({ workspaceId })

	const permissionType = myPermission?.type
	const userDropdown = useMemo(
		() => (
			<UserDropdown permissionType={permissionType} showPersonalArea={true} />
		),
		[permissionType],
	)

	useRenderInHeader("user", userDropdown)

	return null
}
