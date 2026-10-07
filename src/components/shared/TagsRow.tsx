import styled from "@emotion/styled"
import { concat, uniqBy } from "lodash"
import type { SourceDto, TagDto } from "src/api/model"

interface TagsRowProps {
	tags: TagDto[]
	source: SourceDto | null
	isMobile?: boolean
}

export function TagsRow({ tags, source, isMobile = false }: TagsRowProps) {
	const allTags = uniqBy(concat(tags, source?.tags ?? []), "id")
	return (
		<TagsWrapper>
			{allTags.map((tag) => (
				<TagChip $isMobile={isMobile} key={tag.id}>
					{tag.name}
				</TagChip>
			))}
		</TagsWrapper>
	)
}

const TagsWrapper = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`

const TagChip = styled.span<{ $isMobile: boolean }>`
  display: inline-flex;
  align-items: center;
  padding: 1px 8px;
  border-radius: 4px;
  font-size: ${({ $isMobile }) => ($isMobile ? "var(--fs-md)" : "var(--fs-sm)")};
  line-height: 20px;
  background: var(--card-background);
  border: ${({ $isMobile }) => ($isMobile ? "none" : "1px solid var(--chip-line)")};
  color: var(--sea-ink);
  white-space: nowrap;
`
