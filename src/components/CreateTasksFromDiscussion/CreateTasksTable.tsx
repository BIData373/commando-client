import { useRef, useState } from 'react'
import styled from '@emotion/styled'
import { DataTable } from '../ui/data-table'
import columns, { type TaskRow, type TaskTableMeta } from './TasksColumns'
import TaskAssigneeExpansion from './TaskAssigneeExpansion'
import { TrashButton } from '../shared/TrashButton'

// ─── Constants ──────────────────────────────────────────────────────────────

interface CreateTasksTableProps {
  onSave: (tasks: TaskRow[]) => void
  onBack: () => void
}

// ─── Component ──────────────────────────────────────────────────────────────

function CreateTasksTable({ onSave, onBack }: CreateTasksTableProps) {
  const nextRowId = useRef(1)

  function createEmptyRow(): TaskRow {
    return {
      id: nextRowId.current++,
      title: '',
      deadlineType: null,
      dueDate: null,
      assigneeIds: [],
      assigneeDetails: {},
      notes: '',
      isImportant: false,
    }
  }

  const [rows, setRows] = useState<TaskRow[]>([createEmptyRow()])
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set())

  function removeExpandedRow(id: number) {
    setExpandedRows((prev) => {
      const next = new Set(prev)
      next.delete(id)
      return next
    })
  }

  function updateRow(id: number, updates: Partial<TaskRow>) {
    setRows((prev) => {
      const next = prev.map((r) => (r.id === id ? { ...r, ...updates } : r))
      const last = next[next.length - 1]
      if (last.title.trim()) {
        next.push(createEmptyRow())
      }
      return next
    })

    if ('assigneeIds' in updates) {
      const newIds = updates.assigneeIds!
      if (newIds.length > 1) {
        setExpandedRows((prev) => new Set(prev).add(id))
      } else {
        removeExpandedRow(id)
      }
    }
  }

  function toggleRowExpansion(id: number) {
    setExpandedRows((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function deleteRow(id: number) {
    setRows((prev) => {
      const next = prev.filter((r) => r.id !== id)
      if (next.length === 0) return [createEmptyRow()]
      return next
    })
    removeExpandedRow(id)
  }

  function handleSave() {
    const filled = rows.filter((r) => r.title.trim())
    onSave(filled)
  }

  const filledCount = rows.filter((r) => r.title.trim()).length
  const hasAnyTask = filledCount > 0

  const meta: TaskTableMeta = { updateRow, expandedRows, toggleRowExpansion }


  return (
    <TableWrapper>
      <TableOuterContainer>
        <DataTable
          columns={columns}
          data={rows}
          getRowId={(row) => String(row.id)}
          meta={meta}
          containerClassName="overflow-x-hidden"
          renderRowOverlay={(row) => {
            const canDelete = row.original.title.trim().length > 0 && row.index !== rows.length - 1
            return canDelete ? (
              <RowDeleteButton size={14} onClick={() => deleteRow(row.original.id)} />
            ) : null
          }}
          renderRowExpansion={(row) =>
            row.original.assigneeIds.length > 1 && expandedRows.has(row.original.id) ? (
              <TaskAssigneeExpansion
                row={row.original}
                onUpdateRow={(updates) => updateRow(row.original.id, updates)}
                onCollapse={() => toggleRowExpansion(row.original.id)}
              />
            ) : null
          }
        />
      </TableOuterContainer>

      <FooterRow>
        <SaveButton onClick={handleSave} disabled={!hasAnyTask}>
          שמור {hasAnyTask && `(${filledCount})`}
        </SaveButton>
        <BackButton onClick={onBack}>
          חזור
        </BackButton>
      </FooterRow>
    </TableWrapper>
  )
}

export default CreateTasksTable

// ─── Table Styled Components ────────────────────────────────────────────────

const TableWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  flex: 1;
  min-height: 0;
  justify-content: space-between;
  overflow-x: hidden;
`

const TableOuterContainer = styled.div`
  direction: rtl;
  border-radius: 8px;
  border: 0.5px solid var(--Background-color-bg-text-active);
  overflow-x: hidden;
  overflow-y: auto;
  box-shadow: var(--card-shadow-default);

  table {
    border-collapse: collapse;
    table-layout: fixed;
  }

  th {
    height: 48px;
    padding: 12px;
    background: var(--background);
    border-right: 0.5px solid var(--Background-color-bg-text-active);
    text-align: start;
    vertical-align: middle;
    white-space: nowrap;

    &:first-of-type {
      border-right: none;
    }
  }

  tr[data-slot="table-row"] {
    position: relative;

    &:hover td {
      background: var(--background-area);
    }

    &:last-of-type td{
    border-bottom: none;
    }
  }

  td {
    height: 44px;
    padding: 0px 12px;
    background: var(--background);
    border: 0.5px solid var(--Background-color-bg-text-active);
    vertical-align: middle;

    &:first-of-type {
      border-right: none;
    }

    &:focus-within {
      outline: 1px solid var(--button-color-hover);
      outline-offset: -2px;
    }
  }
`

const RowDeleteButton = styled(TrashButton)`
  position: absolute;
  inset-inline-start: -32px;
  inset-block-start: 50%;
  transform: translateY(-50%);
  display: none;
  width: 24px;
  height: 24px;
  border-radius: 4px;
  padding: 0;
  opacity: 1;

  &:hover {
    color: #ff4d4f;
    background: rgba(255, 77, 79, 0.06);
  }

  tr:hover > & {
    display: flex;
  }
`

// ─── Footer ─────────────────────────────────────────────────────────────────

const FooterRow = styled.div`
  direction: ltr;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
`

const SaveButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 123px;
  height: 40px;
  border: none;
  border-radius: 8px;
  background: var(--default-linear);
  color: var(--background);
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  cursor: pointer;
  white-space: nowrap;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    box-shadow: var(--shadow-inset);
    pointer-events: none;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    opacity: 0.9;
  }
`

const BackButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 133px;
  height: 40px;
  border: 1px solid var(--Background-color-bg-text-active);
  border-radius: 8px;
  background: white;
  color: var(--text-color-2);
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  cursor: pointer;
  white-space: nowrap;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    box-shadow: var(--shadow-inset);
    pointer-events: none;
  }

  &:hover {
    border-color: var(--button-color-hover);
    color: var(--button-color-hover);
  }
`
