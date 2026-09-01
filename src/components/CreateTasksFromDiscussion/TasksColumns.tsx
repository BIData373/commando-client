import styled from "@emotion/styled"
import type { ColumnDef } from "@tanstack/react-table"
import type { CreateTaskDto } from "src/api/model"
import FlagIcon from "../shared/FlagIcon"
import ImportantFlagTooltip from "../shared/ImportantFlagTooltip"
import { TrashButton } from "../shared/TrashButton"
import { Checkbox } from "../ui/checkbox"
import AssigneeTableCell from "./AssigneeTableCell"
import DeadlineCell from "./DeadlineCell"
import NotesCell from "./NotesCell"
import TagsTableCell from "./TagsTableCell"

// ─── Types ──────────────────────────────────────────────────────────────────

export interface NewTaskRow extends CreateTaskDto {
	id: number
	rowKey: string
	taskId?: number
	touched?: boolean
	assigneeIds: number[]
	assigneeDetails: Record<number, string>
}

export enum TaskColumnId {
	Title = "title",
	Notes = "notes",
}

export interface TaskTableMeta {
	updateRow: (id: number, updates: Partial<NewTaskRow>) => void
	expandedRows: Set<number>
	toggleRowExpansion: (id: number) => void
	deleteRow: (id: number) => void
	isLastRow: (index: number) => boolean
	lockedTags: string[]
}

// ─── Cell Handlers ─────────────────────────────────────────────────────────

export function handleTextareaChange(
	e: React.ChangeEvent<HTMLTextAreaElement>,
	id: number,
	field: TaskColumnId,
	updateRow: TaskTableMeta["updateRow"],
) {
	updateRow(id, { [field]: e.target.value })
}

function handleImportantChange(
	checked: boolean,
	id: number,
	updateRow: TaskTableMeta["updateRow"],
) {
	updateRow(id, { flagged: checked })
}

function handleDelete(id: number, deleteRow: TaskTableMeta["deleteRow"]) {
	deleteRow(id)
}

export function handleCellKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
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

// ─── Columns ────────────────────────────────────────────────────────────────

const columns: ColumnDef<NewTaskRow>[] = [
	{
		id: "title",
		size: 583,
		header: () => (
			<HeaderLabelGroup>
				<RequiredMark>*</RequiredMark>
				<HeaderLabel>הנחיה</HeaderLabel>
			</HeaderLabelGroup>
		),
		cell: ({ row, table }) => {
			const { id, title } = row.original
			const { updateRow } = table.options.meta as TaskTableMeta
			const uniqueTextareaId = `textarea-${id}-${title}`
			return (
				<TextareaCellWrapper as="label">
					<CellTextarea
						id={uniqueTextareaId}
						$color="var(--text-color-2)"
						data-row={row.index}
						data-col={0}
						value={title}
						onChange={(e) =>
							handleTextareaChange(e, id, TaskColumnId.Title, updateRow)
						}
						onKeyDown={handleCellKeyDown}
						placeholder="הנחיה"
						rows={1}
					/>
				</TextareaCellWrapper>
			)
		},
	},
	{
		id: "deadline",
		size: 138,
		header: () => <HeaderLabel>{`תג"ב`}</HeaderLabel>,
		cell: ({
			row: {
				original: { id, dueDate, deadlineType },
			},
			table,
		}) => {
			const { updateRow } = table.options.meta as TaskTableMeta
			return (
				<DeadlineCell
					deadlineType={deadlineType}
					dueDate={dueDate}
					onDeadlineTypeChange={(type) =>
						updateRow(id, { deadlineType: type, dueDate: undefined })
					}
					onDateChange={(date) => updateRow(id, { dueDate: date })}
				/>
			)
		},
	},
	{
		id: "assignee",
		size: 170,
		header: () => <HeaderLabel>אחראי</HeaderLabel>,
		cell: ({ row, table }) => (
			<AssigneeTableCell
				row={row.original}
				meta={table.options.meta as TaskTableMeta}
			/>
		),
	},
	{
		id: "notes",
		size: 274,
		header: () => <HeaderLabel>הערה</HeaderLabel>,
		cell: ({ row, table }) => (
			<NotesCell row={row} meta={table.options.meta as TaskTableMeta} />
		),
	},
	{
		id: "tags",
		size: 224,
		header: () => <HeaderLabel>תגיות</HeaderLabel>,
		cell: ({ row, table }) => (
			<TagsTableCell
				row={row.original}
				meta={table.options.meta as TaskTableMeta}
			/>
		),
	},
	{
		id: "important",
		size: 62,
		header: () => (
			<HeaderIcons>
				<FlagIcon />
				<ImportantFlagTooltip side="top" />
			</HeaderIcons>
		),
		cell: ({
			row: {
				original: { id, flagged },
			},
			table,
		}) => {
			const { updateRow } = table.options.meta as TaskTableMeta
			return (
				<CheckboxWrapper>
					<Checkbox
						checked={flagged}
						onCheckedChange={(checked) =>
							handleImportantChange(checked as boolean, id, updateRow)
						}
					/>
				</CheckboxWrapper>
			)
		},
	},
	{
		id: "delete",
		size: 35,
		header: () => null,
		cell: ({ row, table }) => {
			const { deleteRow, isLastRow } = table.options.meta as TaskTableMeta

			return !row.original.title.trim().length ||
				isLastRow(row.index) ? null : (
				<StyledTrashButton
					onClick={() => handleDelete(row.original.id, deleteRow)}
					size={14}
				/>
			)
		},
	},
]

export default columns

// ─── Header Elements ────────────────────────────────────────────────────────

const HeaderLabel = styled.span`
  font-size: var(--fs-base);
  font-weight: 500;
  line-height: 24px;
  color: var(--text-color);
  white-space: nowrap;
`

const HeaderLabelGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
`

const RequiredMark = styled.span`
  color: var(--Components-Form-Component-labelRequiredMarkColor);
  font-size: var(--fs-btn);
  line-height: 22px;
`

const HeaderIcons = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  justify-content: center;
`

const TextareaCellWrapper = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
  cursor: text;
`

const CellTextarea = styled.textarea<{ $color?: string }>`
  width: 100%;
  background: transparent;
  font-size: var(--fs-btn);
  font-weight: 400;
  line-height: 18px;
  /* Auto-grows with content, capped at two lines */
  field-sizing: content;
  max-height: 2lh;
  color: ${({ $color }) => $color ?? "var(--text-color)"};
  text-align: right;
  outline: none;
  resize: none;
  overflow-y: auto;
  overflow-x: hidden;

  &::placeholder {
    color: var(--Text-color-text-placeholder);
  }
`

const CheckboxWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
`

const StyledTrashButton = styled(TrashButton)`
  opacity: 0;
  transition: opacity 0.15s ease-in-out;

  tr:hover & {
    opacity: 1;
  }
`
