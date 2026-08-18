import styled from "@emotion/styled"
import type { ColumnDef } from "@tanstack/react-table"
import {
	type NewTaskRow,
	TaskColumnId,
	type TaskTableMeta,
} from "./TasksColumns"

/**
 * Notes column for the discussion-based task creation table.
 * Extracted to allow easy removal/restoration of notes feature.
 */

function handleTextareaChange(
	e: React.ChangeEvent<HTMLTextAreaElement>,
	id: number,
	updateRow: TaskTableMeta["updateRow"],
) {
	const textarea = e.target
	textarea.style.height = "auto"
	textarea.style.height = `${Math.min(textarea.scrollHeight, 40)}px`
	updateRow(id, { [TaskColumnId.Notes]: textarea.value })
}

function handleCellKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
	const target = e.target as HTMLElement
	const row = Number(target.dataset.row)
	const col = Number(target.dataset.col)
	if (isNaN(row) || isNaN(col)) return

	const container = target.closest("table")
	if (!container) return

	if (e.key === "Enter") {
		e.preventDefault()
		const next = container.querySelector<HTMLElement>(
			`[data-row="${row + 1}"][data-col="0"]`,
		)
		next?.focus()
		return
	}

	if (e.key === "Tab") {
		const nextCol = e.shiftKey ? col - 1 : col + 1
		const next = container.querySelector<HTMLElement>(
			`[data-row="${row}"][data-col="${nextCol}"]`,
		)
		if (!next) return
		e.preventDefault()
		next.focus()
	}
}

export const notesColumn: ColumnDef<NewTaskRow> = {
	id: "notes",
	size: 350,
	header: () => <HeaderLabel>הערות הנחיה</HeaderLabel>,
	cell: ({ row, table }) => {
		const { id, notes } = row.original
		const { updateRow } = table.options.meta as TaskTableMeta
		return (
			<TextareaCellWrapper>
				<CellTextarea
					data-row={row.index}
					data-col={1}
					value={notes ?? ""}
					onChange={(e) => handleTextareaChange(e, id, updateRow)}
					onKeyDown={handleCellKeyDown}
					placeholder=""
					rows={1}
				/>
			</TextareaCellWrapper>
		)
	},
}

const HeaderLabel = styled.span`
  font-size: var(--fs-base);
  font-weight: 500;
  line-height: 24px;
  color: var(--text-color);
  white-space: nowrap;
`

const TextareaCellWrapper = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
  cursor: text;
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
