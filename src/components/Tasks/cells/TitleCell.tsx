import styled from "@emotion/styled"
import type { CellContext } from "@tanstack/react-table"
import { useCallback, useState } from "react"
import type { TaskRowDto } from "src/api/model"
import type { AppTableFeatures } from "src/consts/table-features"
import { useTaskTable } from "src/providers/TaskTableProvider"
import EllipsisTooltip from "../../shared/EllipsisTooltip"
import FlagIcon from "../../shared/FlagIcon"
import HighlightMatch from "../../shared/HighlightMatch"

const ROW_HEIGHT = 43

export function TitleCell<TTask extends TaskRowDto, TValue>({
	row: {
		original: { title, description, flagged },
	},
}: CellContext<AppTableFeatures, TTask, TValue>) {
	const { searchQuery, titleExpanded } = useTaskTable()
	const [isWrapped, setIsWrapped] = useState(false)

	const cellRef = useCallback(
		(node: HTMLDivElement | null) => {
			if (!node || !titleExpanded) {
				setIsWrapped(false)
				return
			}

			const td = node.closest("td")
			if (!td) return

			const observer = new ResizeObserver(() => {
				setIsWrapped(td.clientHeight > ROW_HEIGHT)
			})

			observer.observe(td)

			return () => observer.disconnect()
		},
		[titleExpanded],
	)

	const titleContent = (
		<>
			<TitlePart $expanded={titleExpanded}>
				{searchQuery ? (
					<HighlightMatch text={title} query={searchQuery} variant="mark" />
				) : (
					title
				)}
			</TitlePart>
			{description && (
				<>
					<TitleSeparator> - </TitleSeparator>
					<DetailsPart $expanded={titleExpanded}>
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
		</>
	)

	return (
		<CellRoot
			ref={cellRef}
			$expanded={titleExpanded}
			data-cell-wrapped={isWrapped ? "" : undefined}
		>
			{flagged && <FlagIcon />}
			{titleExpanded ? (
				<ExpandedContent>{titleContent}</ExpandedContent>
			) : (
				<TitleContent
					tooltip={`${title}${description ? ` - ${description}` : ""}`}
				>
					{titleContent}
				</TitleContent>
			)}
		</CellRoot>
	)
}

const CellRoot = styled.div<{ $expanded: boolean }>`
  display: flex;
  align-items: ${({ $expanded }) => ($expanded ? "flex-start" : "center")};
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

const ExpandedContent = styled.div`
  flex: 1;
  min-width: 0;
  white-space: normal;
  word-break: break-word;
`

const TitlePart = styled.span<{ $expanded: boolean }>`
  font-weight: 400;
  min-width: 0;
  ${({ $expanded }) =>
		$expanded
			? "white-space: normal; word-break: break-word;"
			: "overflow: hidden; text-overflow: ellipsis; white-space: nowrap; flex: 1 1 50%; max-width: max-content;"}
`

const TitleSeparator = styled.span`
  flex-shrink: 0;
  white-space: nowrap;
`

const DetailsPart = styled.span<{ $expanded: boolean }>`
  font-weight: 300;
  min-width: 0;
  ${({ $expanded }) =>
		$expanded
			? "white-space: normal; word-break: break-word;"
			: "overflow: hidden; text-overflow: ellipsis; white-space: nowrap; flex: 1 1 50%; max-width: max-content;"}
`
