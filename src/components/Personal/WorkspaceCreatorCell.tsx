import styled from "@emotion/styled"
import type { UserDto, WorkspaceWithPermissionDto } from "src/api/model"
import { useOverflow } from "src/hooks/useOverflow"
import { formatMesibaIcon } from "src/utils/icon-utils"
import HighlightMatch from "../shared/HighlightMatch"
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip"

interface WorkspaceCreatorCellProps {
	workspace: WorkspaceWithPermissionDto
	createdBy: UserDto
	searchQuery?: string
}

export default function WorkspaceCreatorCell({
	workspace,
	createdBy,
	searchQuery,
}: WorkspaceCreatorCellProps) {
	const { ref, isOverflowing } = useOverflow<HTMLSpanElement>({
		content: workspace.title,
		includeDescendants: true,
	})

	const creatorName = createdBy?.info?.displayName ?? createdBy?.upn ?? ""

	return (
		<Tooltip>
			<TooltipTrigger asChild>
				<CellWrapper>
					{workspace.icon && (
						<WorkspaceIcon
							src={formatMesibaIcon(workspace.icon)}
							alt={workspace.title}
						/>
					)}

					<TitleText ref={ref}>
						<HighlightMatch
							text={workspace.title}
							query={searchQuery ?? ""}
							variant="mark"
						/>
					</TitleText>
				</CellWrapper>
			</TooltipTrigger>

			<CreatorTooltip side="top">
				{isOverflowing && (
					<TooltipLine>מפקד מנחה:{workspace.title}</TooltipLine>
				)}

				{creatorName && <TooltipLine>נוצר ע"י: {creatorName}</TooltipLine>}
			</CreatorTooltip>
		</Tooltip>
	)
}

const CellWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  height: 100%;
  min-width: 0;
`

const WorkspaceIcon = styled.img`
  width: 20px;
  height: 20px;
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
  background: var(--Components-Tooltip-Global-colorBgSpotlight);
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
