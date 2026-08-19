import styled from "@emotion/styled"
import TagFieldInput from "../TagField/TagFieldInput"
import type { NewTaskRow, TaskTableMeta } from "./TasksColumns"

// ─── Types ───────────────────────────────────────────────────────────────────

interface TagsTableCellProps {
	row: NewTaskRow
	meta: TaskTableMeta
}

// ─── Component ───────────────────────────────────────────────────────────────

function TagsTableCell({ row, meta }: TagsTableCellProps) {
	const { lockedTags } = meta
	const rowTags = row.tags ?? []
	const displayTags = Array.from(new Set([...lockedTags, ...rowTags]))

	function handleTagSelect(tag: string) {
		if (!lockedTags.includes(tag) && !rowTags.includes(tag)) {
			meta.updateRow(row.id, { tags: [...rowTags, tag] })
		}
	}

	function handleTagRemove(tag: string) {
		meta.updateRow(row.id, { tags: rowTags.filter((t) => t !== tag) })
	}

	return (
		<TagsCellOuter as="label">
			<TagFieldInput
				workspaceId={row.workspaceId}
				tags={displayTags}
				lockedTags={lockedTags}
				onTagSelect={handleTagSelect}
				onTagRemove={handleTagRemove}
				variant="flush"
			/>
		</TagsCellOuter>
	)
}

export default TagsTableCell

// ─── Styled ─────────────────────────────────────────────────────────────────

const TagsCellOuter = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
  cursor: text;
`
