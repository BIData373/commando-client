import { useMemo } from "react"
import WorkspaceIconTitle from "src/components/shared/WorkspaceIconTitle"
import { useRenderInHeader } from "src/providers/HeaderProvider"
import { useWorkspace } from "src/providers/WorkspaceProvider"

export function WorkspaceTitle() {
	const {
		workspace: { icon, title },
	} = useWorkspace()

	const headerTitle = useMemo(
		() => <WorkspaceIconTitle icon={icon} title={title} iconSize={32} />,
		[icon, title],
	)

	useRenderInHeader("center", headerTitle)

	return null
}
