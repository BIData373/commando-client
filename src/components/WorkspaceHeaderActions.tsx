import { Archive, Settings } from "lucide-react"
import { PermissionType } from "src/api/model"
import { useGetMyPermission } from "src/api/permission/permission"
import { useWorkspace } from "src/providers/WorkspaceProvider"
import { HeaderIconButton } from "./shared/HeaderIconButton"

export function WorkspaceHeaderActions() {
	const {
		workspace: { id: workspaceId, urlName },
	} = useWorkspace()
	const { data: myPermission } = useGetMyPermission({ workspaceId })
	const isManager = myPermission?.type === PermissionType.MANAGER

	return (
		<>
			<HeaderIconButton
				icon={<Archive size={18} />}
				tooltip="ארכיון הנחיות"
				linkProps={{ to: "/workspace/$urlName/archive", params: { urlName } }}
			/>
			{isManager && (
				<HeaderIconButton
					icon={<Settings size={18} />}
					tooltip="הגדרות סביבה"
					linkProps={{
						to: "/workspace/$urlName/settings",
						params: { urlName },
					}}
				/>
			)}
		</>
	)
}
