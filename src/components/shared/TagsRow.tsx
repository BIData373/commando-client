import styled from "@emotion/styled"
import type { TagDto } from "src/api/model"
import { MOBILE_MEDIA_QUERY } from "src/hooks/use-mobile"

interface TagsRowProps {
	allTags: TagDto[]
}

export function TagsRow({ allTags }: TagsRowProps) {
	return (
		<TagsWrapper>
			{allTags.map((tag) => (
				<TagChip key={tag.id}>{tag.name}</TagChip>
			))}
		</TagsWrapper>
	)
}

const TagsWrapper = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`

const TagChip = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 1px 8px;
  border-radius: 4px;
  font-size: var(--fs-sm);
  line-height: 20px;
  background: var(--card-background);
  border: 1px solid var(--chip-line);
  color: var(--sea-ink);
  white-space: nowrap;

  ${MOBILE_MEDIA_QUERY} {
    font-size: var(--fs-base);
    border: none;
  }
`
