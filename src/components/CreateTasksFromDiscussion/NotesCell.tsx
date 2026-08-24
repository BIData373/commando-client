import styled from "@emotion/styled"
import { NOTES_MAX_LENGTH } from "../../utils/form-utils"
import {
	handleCellKeyDown,
	handleTextareaChange,
	type NewTaskRow,
	TaskColumnId,
	type TaskTableMeta,
} from "./TasksColumns"

const CHAR_COUNT_THRESHOLD = 140

// ─── Types ──────────────────────────────────────────────────────────────────

interface NotesCellProps {
	row: { index: number; original: NewTaskRow }
	meta: TaskTableMeta
}

// ─── Component ──────────────────────────────────────────────────────────────

function NotesCell({ row, meta }: NotesCellProps) {
	const { id, notes } = row.original
	const length = (notes ?? "").length

	function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
		handleTextareaChange(e, id, TaskColumnId.Notes, meta.updateRow)
	}

	return (
		<NotesCellWrapper>
			<CellTextarea
				data-row={row.index}
				data-col={1}
				value={notes ?? ""}
				onChange={handleChange}
				onKeyDown={handleCellKeyDown}
				placeholder="הערה"
				rows={1}
				maxLength={NOTES_MAX_LENGTH}
			/>
			{length >= CHAR_COUNT_THRESHOLD && (
				<NotesCharCount $limit={length >= NOTES_MAX_LENGTH}>
					{length}/{NOTES_MAX_LENGTH}
				</NotesCharCount>
			)}
		</NotesCellWrapper>
	)
}

export default NotesCell

// ─── Styled ─────────────────────────────────────────────────────────────────

const NotesCharCount = styled.span<{ $limit?: boolean }>`
  position: absolute;
  inset-block-end: 2px;
  inset-inline-end: 4px;
  font-size: var(--fs-sm);
  line-height: 18px;
  color: ${({ $limit }) => ($limit ? "var(--Colors-Brand-Error-colorErrorActive)" : "var(--sea-ink-soft)")};
  pointer-events: none;
  display: none;
`

const NotesCellWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  height: 100%;
  cursor: text;

  &:focus-within ${NotesCharCount} {
    display: block;
  }
`

const CellTextarea = styled.textarea`
  width: 100%;
  background: transparent;
  font-size: var(--fs-btn);
  font-weight: 400;
  line-height: 18px;
  color: var(--text-color);
  text-align: right;
  outline: none;
  resize: none;
  overflow-y: auto;
  overflow-x: hidden;

  &::placeholder {
    color: var(--Text-color-text-placeholder);
  }
`
