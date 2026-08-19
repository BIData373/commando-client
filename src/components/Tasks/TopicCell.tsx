import styled from "@emotion/styled"
import HighlightMatch from "../shared/HighlightMatch"
import { OverflowRow } from "../shared/OverflowRow"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "../ui/hover-card"

interface TopicCellProps {
	tags: string[]
	searchQuery?: string
}

export function TopicCell({ tags, searchQuery }: TopicCellProps) {
	return (
		<OverflowRow
			preserveOrder
			gap={4}
			items={tags.map((tag) => (
				<Tag key={tag}>
					<HighlightMatch text={tag} query={searchQuery ?? ""} variant="mark" />
				</Tag>
			))}
			renderOverflow={(remaining, hiddenTags) => (
				<HoverCard openDelay={200} closeDelay={100}>
					<HoverCardTrigger asChild>
						<OverflowTag>{remaining}+</OverflowTag>
					</HoverCardTrigger>
					<StyledHoverCardContent side="top" sideOffset={6}>
						<OverflowList>{hiddenTags}</OverflowList>
					</StyledHoverCardContent>
				</HoverCard>
			)}
		/>
	)
}

const Tag = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 1px 8px;
  border-radius: 4px;
  font-size: var(--fs-sm);
  line-height: 20px;
  background: rgba(0, 0, 0, 0.02);
  color: rgba(0, 0, 0, 0.88);
  white-space: nowrap;
  flex-shrink: 0;
`

const OverflowTag = styled.button`
  display: inline-flex;
  align-items: center;
  padding: 1px 8px;
  border-radius: 4px;
  font-size: var(--fs-sm);
  line-height: 20px;
  background: rgba(0, 0, 0, 0.02);
  color: rgba(0, 0, 0, 0.88);
  white-space: nowrap;
  flex-shrink: 0;
  border: none;
  cursor: pointer;
`

const StyledHoverCardContent = styled(HoverCardContent)`
  width: auto;
  min-width: unset;
  padding: 8px;
`

const OverflowList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
`
