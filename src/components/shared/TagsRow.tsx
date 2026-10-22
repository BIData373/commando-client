import styled from "@emotion/styled"
import type { SourceDto, TagDto } from "src/api/model"

interface TagsRowProps {
	allTags: TagDto[]
	isMobile?: boolean
}

export function TagsRow({ allTags, isMobile = false }: TagsRowProps) {
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
  font-size: ${({ $isMobile }) => ($isMobile ? "var(--fs-base)" : "var(--fs-sm)")};
  line-height: 20px;
  background: var(--card-background);
  border: ${({ $isMobile }) => ($isMobile ? "none" : "1px solid var(--chip-line)")};
  color: var(--sea-ink);
  white-space: nowrap;
`
