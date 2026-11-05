import styled from "@emotion/styled"
import EllipsisTooltip from "../../shared/EllipsisTooltip"
import HighlightMatch from "../../shared/HighlightMatch"

interface TitleTextProps {
	title: string
	description: string | null
	searchQuery: string
	titleExpanded: boolean
}

export function TitleText({
	title,
	description,
	searchQuery,
	titleExpanded,
}: TitleTextProps) {
	const content = (
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

	return titleExpanded ? (
		<ExpandedContent>{content}</ExpandedContent>
	) : (
		<TitleContent tooltip={`${title}${description ? ` - ${description}` : ""}`}>
			{content}
		</TitleContent>
	)
}

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
