import styled from "@emotion/styled"
import type { UserDto, WorkspaceDto } from "src/api/model"
import { useOverflow } from "src/hooks/useOverflow"
import { formatMesibaIcon } from "src/utils/icon-utils"
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip"
import HighlightMatch from "./HighlightMatch"
import WorkspaceIconTitle from "./WorkspaceIconTitle"

interface WorkspaceCellProps {
	workspace?: WorkspaceDto
	createdBy?: UserDto
	iconSize?: number
	searchQuery?: string
}

export default function WorkspaceCell({
	workspace,
	createdBy,
	iconSize = 20,
	searchQuery,
}: WorkspaceCellProps) {
	const { ref, isOverflowing } = useOverflow<HTMLSpanElement>({
		content: workspace?.title,
		includeDescendants: true,
	})

	if (!workspace) {
		return null
	}

	const creatorName = createdBy?.info?.displayName ?? createdBy?.upn

	if (!creatorName) {
		return (
			<StyledWorkspaceIconTitle
				icon={workspace.icon}
				title={workspace.title}
				iconSize={iconSize}
				rounded
			>
				<HighlightMatch
					text={workspace.title}
					query={searchQuery ?? ""}
					variant="mark"
				/>
			</StyledWorkspaceIconTitle>
		)
	}

	return (
		<Tooltip>
			<CellWrapper>
				{workspace.icon && (
					<WorkspaceIcon
						$size={iconSize}
						src={formatMesibaIcon(workspace.icon)}
						alt={workspace.title}
					/>
				)}

				<TooltipTrigger asChild>
					<TitleText ref={ref}>
						<HighlightMatch
							text={workspace.title}
							query={searchQuery ?? ""}
							variant="mark"
						/>
					</TitleText>
				</TooltipTrigger>
			</CellWrapper>

			<CreatorTooltip side="top">
				{isOverflowing && <TooltipLine>{workspace.title}</TooltipLine>}

				<TooltipLine>{`נוצר ע"י: ${creatorName}`}</TooltipLine>
			</CreatorTooltip>
		</Tooltip>
	)
}

const StyledWorkspaceIconTitle = styled(WorkspaceIconTitle)`
  font-size: var(--fs-btn);
  font-weight: 400;
  color: var(--text-color);
`

const CellWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  height: 100%;
  min-width: 0;
`

const WorkspaceIcon = styled.img<{ $size: number }>`
  width: ${({ $size }) => `${$size}px`};
  height: ${({ $size }) => `${$size}px`};
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
`

const TitleText = styled.span`
  display: block;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  unicode-bidi: plaintext;
  font-size: var(--fs-btn);
  font-weight: 400;
  color: var(--text-color);
`

const CreatorTooltip = styled(TooltipContent)`
  display: flex;
  flex-direction: column;
  gap: 2px;
  border-radius: 6px;
  padding: 6px 8px;
  font-size: var(--fs-btn);
  font-weight: 400;
  line-height: 22px;
  color: var(--background);
  text-align: start;
  max-width: 300px;
`

const TooltipLine = styled.span`
  display: block;
  min-width: 0;
  white-space: normal;
  overflow-wrap: break-word;
`
