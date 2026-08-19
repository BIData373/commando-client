import styled from "@emotion/styled"
import EllipsisTooltip from "src/components/shared/EllipsisTooltip"
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

			<EllipsisTooltip tooltip={title}>{title}</EllipsisTooltip>
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
