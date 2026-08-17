import styled from "@emotion/styled"
import type { WorkspaceDto } from "src/api/model"
import { formatMesibaIcon } from "src/utils/icon-utils"
import HighlightMatch from "./HighlightMatch"

interface WorkspaceCellProps {
	workspace?: WorkspaceDto
	iconSize?: number
	searchQuery?: string
}

export default function WorkspaceCell({
	workspace,
	iconSize = 20,
	searchQuery,
}: WorkspaceCellProps) {
	return workspace ? (
		<WorkspaceWrapper>
			{workspace.icon && (
				<WorkspaceIconImage
					$size={iconSize}
					src={formatMesibaIcon(workspace.icon)}
					alt={workspace.title}
				/>
			)}

			<WorkspaceCellName>
				<HighlightMatch
					text={workspace.title}
					query={searchQuery ?? ""}
					variant="mark"
				/>
			</WorkspaceCellName>
		</WorkspaceWrapper>
	) : null
}

const WorkspaceWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: flex-start;
`

const WorkspaceCellName = styled.span`
  font-size: var(--fs-btn);
  font-weight: 400;
  color: var(--text-color);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const WorkspaceIconImage = styled.img<{ $size: number }>`
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;

  ${({ $size }) => `
    width: ${$size}px;
    height: ${$size}px;
  `}
`
