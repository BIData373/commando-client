import styled from '@emotion/styled'
import { type ColumnDef } from '@tanstack/react-table'
import { Checkbox } from '../ui/checkbox'
import { type DeadlineType } from '../shared/DeadlineTag'
import FlagIcon from '../shared/FlagIcon'
import ImportantFlagTooltip from '../shared/ImportantFlagTooltip'
import DeadlineCell from './DeadlineCell'
import AssigneeTableCell from './AssigneeTableCell'

// ─── Types ──────────────────────────────────────────────────────────────────
export enum TaskColumnId {
  Title = 'title',
  Notes = 'notes',
}

export interface TaskRow {
  id: string
  title: string
  deadlineType: DeadlineType | null
  dueDate: Date | null
  assigneeIds: number[]
  assigneeDetails: Record<number, string>
  notes: string
  isImportant: boolean
}

export interface TaskTableMeta {
  updateRow: (id: string, updates: Partial<TaskRow>) => void
  expandedRows: Set<string>
  toggleRowExpansion: (id: string) => void
}

// ─── Cell Handlers ─────────────────────────────────────────────────────────

const MAX_HEIGHT = 40

function handleTextareaChange(
  e: React.ChangeEvent<HTMLTextAreaElement>,
  id: string,
  field: TaskColumnId,
  updateRow: TaskTableMeta['updateRow'],
) {
  const textarea = e.target
  textarea.style.height = 'auto'
  textarea.style.height = `${Math.min(textarea.scrollHeight, MAX_HEIGHT)}px`
  updateRow(id, { [field]: textarea.value })
}

function handleImportantChange(
  checked: boolean,
  id: string,
  updateRow: TaskTableMeta['updateRow'],
) {
  updateRow(id, { isImportant: checked === true })
}

function handleCellKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
  if (e.key === 'Enter') {
    e.preventDefault()
    const currentRow = (e.target as HTMLElement).closest('tr')
    if (!currentRow) return
    let next = currentRow.nextElementSibling
    while (next && next.hasAttribute('data-expansion-row')) {
      next = next.nextElementSibling
    }
    if (!next) return
    const titleTextarea = next.querySelector<HTMLTextAreaElement>('td:first-child textarea')
    titleTextarea?.focus()
    return
  }

  if (e.key === 'Tab') {
    const currentTd = (e.target as HTMLElement).closest('td')
    if (!currentTd) return
    const nextTd = e.shiftKey ? currentTd.previousElementSibling : currentTd.nextElementSibling
    if (!nextTd) return
    const focusable = nextTd.querySelector<HTMLElement>('textarea, button, input, [tabindex]')
    if (!focusable) return
    e.preventDefault()
    focusable.focus()
  }
}

// ─── Columns ────────────────────────────────────────────────────────────────

const columns: ColumnDef<TaskRow>[] = [
  {
    id: 'title',
    size: 695,
    header: () => (
      <HeaderLabelGroup>
        <RequiredMark>*</RequiredMark>
        <HeaderLabel>הנחיה</HeaderLabel>
      </HeaderLabelGroup>
    ),
    cell: ({ row: { original: { id, title } }, table }) => {
      const { updateRow } = table.options.meta as TaskTableMeta
      return (
        <TextareaCellWrapper>
          <CellTextarea
            $color="rgba(0, 0, 0, 0.88)"
            value={title}
            onChange={(e) => handleTextareaChange(e, id, TaskColumnId.Title, updateRow)}
            onKeyDown={handleCellKeyDown}
            placeholder="הנחיה"
            dir="rtl"
            rows={1}
          />
        </TextareaCellWrapper>
      )
    },
  },
  {
    id: 'deadline',
    size: 138,
    header: () => <HeaderLabel>תג&quot;ב</HeaderLabel>,
    cell: ({ row: { original: { id, dueDate, deadlineType } }, table }) => {
      const { updateRow } = table.options.meta as TaskTableMeta
      return (
        <DeadlineCell
          deadlineType={deadlineType}
          dueDate={dueDate}
          onDeadlineTypeChange={(type) => updateRow(id, { deadlineType: type, dueDate: null })}
          onDateChange={(date) => updateRow(id, { dueDate: date })}
        />
      )
    },
  },
  {
    id: 'assignee',
    size: 206,
    header: () => <HeaderLabel>אחראי</HeaderLabel>,
    cell: ({ row, table }) => (
      <AssigneeTableCell
        row={row.original}
        meta={table.options.meta as TaskTableMeta}
      />
    ),
  },
  {
    id: 'notes',
    size: 350,
    header: () => <HeaderLabel>הערות הנחיה</HeaderLabel>,
    cell: ({ row: { original: { id, notes } }, table }) => {
      const { updateRow } = table.options.meta as TaskTableMeta
      return (
        <TextareaCellWrapper>
          <CellTextarea
            value={notes}
            onChange={(e) => handleTextareaChange(e, id, TaskColumnId.Notes, updateRow)}
            onKeyDown={handleCellKeyDown}
            placeholder=""
            dir="rtl"
            rows={1}
          />
        </TextareaCellWrapper>
      )
    },
  },
  {
    id: 'important',
    size: 62,
    header: () => (
      <HeaderIcons>
        <FlagIcon />
        <ImportantFlagTooltip side="top" />
      </HeaderIcons>
    ),
    cell: ({ row: { original: { id, isImportant } }, table }) => {
      const { updateRow } = table.options.meta as TaskTableMeta
      return (
        <CheckboxWrapper>
          <Checkbox
            checked={isImportant}
            onCheckedChange={(checked) => handleImportantChange(checked as boolean, id, updateRow)}
          />
        </CheckboxWrapper>
      )
    },
  },
]

export default columns

// ─── Header Elements ────────────────────────────────────────────────────────

const HeaderLabel = styled.span`
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
  color: rgba(0, 0, 0, 0.65);
  white-space: nowrap;
`

const HeaderLabelGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
`

const RequiredMark = styled.span`
  color: #ff4d4f;
  font-size: 14px;
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
`

const CellTextarea = styled.textarea<{ $color?: string }>`
  width: 100%;
  background: transparent;
  font-size: 14px;
  font-weight: 400;
  line-height: 18px;
  color: ${({ $color }) => $color ?? 'rgba(0, 0, 0, 0.65)'};
  text-align: right;
  outline: none;
  resize: none;
  overflow-y: auto;
  overflow-x: hidden;

  &::placeholder {
    color: rgba(0, 0, 0, 0.25);
  }
`

const CheckboxWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
`
