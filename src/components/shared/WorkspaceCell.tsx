import styled from "@emotion/styled"
import type { WorkspaceDto } from "src/api/model"
import HighlightMatch from "./HighlightMatch"
import WorkspaceIconTitle from "./WorkspaceIconTitle"

interface WorkspaceCellProps {
	workspace?: WorkspaceDto
	iconSize?: number
	searchQuery?: string
	creatorName?: string
}

export default function WorkspaceCell({
	workspace,
	iconSize = 20,
	searchQuery,
	creatorName,
}: WorkspaceCellProps) {
	return workspace ? (
		<StyledWorkspaceIconTitle
			icon={workspace.icon}
			title={workspace.title}
			creatorLabel={creatorName && `נוצר ע"י ${creatorName}`}
			iconSize={iconSize}
			rounded
		>
			<HighlightMatch
				text={workspace.title}
				query={searchQuery ?? ""}
				variant="mark"
			/>
		</StyledWorkspaceIconTitle>
	) : null
}

const StyledWorkspaceIconTitle = styled(WorkspaceIconTitle)`
  font-size: var(--fs-btn);
  font-weight: 400;
  color: var(--text-color);
`
