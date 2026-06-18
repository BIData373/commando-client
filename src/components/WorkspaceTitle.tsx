import styled from "@emotion/styled"
import { useRenderInHeader } from "src/providers/HeaderProvider"
import { useWorkspace } from "src/providers/WorkspaceProvider"
import { formatMesibaIcon } from "src/utils/icon-utils"

export function WorkspaceTitle() {
	const {
		workspace: { icon, title },
	} = useWorkspace()

	useRenderInHeader(
		"center",
		<>
			{icon && (
				<WorkspaceIcon src={formatMesibaIcon(icon)} alt="Workspace icon" />
			)}

			{title}
		</>,
		[icon, title],
	)

	return null
}

const WorkspaceIcon = styled.img`
  width: 32px;
  height: 32px;
  object-fit: contain;
`
