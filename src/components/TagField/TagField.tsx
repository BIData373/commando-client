import styled from "@emotion/styled"
import TagFieldInput from "./TagFieldInput"

// ─── Types ───────────────────────────────────────────────────────────────────

interface TagFieldProps {
	workspaceId: number
	tags: string[]
	lockedTags: string[]
	onTagSelect: (tag: string) => void
	onTagRemove: (tag: string) => void
}

// ─── Component ───────────────────────────────────────────────────────────────

function TagField({
	workspaceId,
	tags,
	lockedTags,
	onTagSelect,
	onTagRemove,
}: TagFieldProps) {
	return (
		<FormItem>
			<FormLabelRow>
				<LabelText>תגיות</LabelText>
			</FormLabelRow>
			<TagFieldInput
				workspaceId={workspaceId}
				tags={tags}
				lockedTags={lockedTags}
				onTagSelect={onTagSelect}
				onTagRemove={onTagRemove}
			/>
		</FormItem>
	)
}

export default TagField

// ─── Styled ─────────────────────────────────────────────────────────────────

const FormItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  width: 100%;
`

const FormLabelRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0px;
  padding-block-end: 8px;
  width: 100%;
`

const LabelText = styled.span`
  font-size: var(--fs-btn);
  font-weight: 400;
  line-height: 22px;
  color: var(--text-color-2);
  white-space: nowrap;
`
