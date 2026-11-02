import styled from "@emotion/styled"
import type { CellContext } from "@tanstack/react-table"
import type { TaskRowDto } from "src/api/model"
import type { AppTableFeatures } from "src/consts/table-features"
import { useTaskTable } from "src/providers/TaskTableProvider"
import EllipsisTooltip from "../../shared/EllipsisTooltip"
import FlagIcon from "../../shared/FlagIcon"
import HighlightMatch from "../../shared/HighlightMatch"

export function TitleCell<TTask extends TaskRowDto, TValue>({
	row: {
		original: { title, description, flagged },
	},
}: CellContext<AppTableFeatures, TTask, TValue>) {
	const { searchQuery } = useTaskTable()

	return (
		<CellRoot>
			{flagged && <FlagIcon />}
			<TitleContent
				tooltip={`${title}${description ? ` - ${description}` : ""}`}
			>
				<TitlePart>
					{searchQuery ? (
						<HighlightMatch text={title} query={searchQuery} variant="mark" />
					) : (
						title
					)}
				</TitlePart>
				{description && (
					<>
						<TitleSeparator> - </TitleSeparator>
						<DetailsPart>
							{searchQuery ? (
								<HighlightMatch
									text={description}
									query={searchQuery}
									variant="mark"
								/>
							) : (
								description
							)}
						</DetailsPart>
					</>
				)}
			</TitleContent>
		</CellRoot>
	)
}

const CellRoot = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--sea-ink);
  font-size: var(--fs-btn);
  font-weight: 400;
  line-height: 20px;
  overflow: hidden;
  width: 100%;
  height: 100%;
  cursor: pointer;
`

const TitleContent = styled(EllipsisTooltip)`
  display: flex;
  align-items: center;
  gap: 6px;
  flex: 1;
  min-width: 0;
`

const TitlePart = styled.span`
  font-weight: 400;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1 1 50%;
  max-width: max-content;
  min-width: 0;
`

const TitleSeparator = styled.span`
  flex-shrink: 0;
  white-space: nowrap;
`

const DetailsPart = styled.span`
  font-weight: 300;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1 1 50%;
  max-width: max-content;
  min-width: 0;
`
