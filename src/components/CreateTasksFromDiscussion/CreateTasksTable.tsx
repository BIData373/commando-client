import { useState } from 'react'
import styled from '@emotion/styled'
import { DataTable } from '../ui/data-table'
import columns, { type TaskRow, type TaskTableMeta } from './TasksColumns'
import TaskAssigneeExpansion from './TaskAssigneeExpansion'
import TaskRowDeleteButton from './TaskRowDeleteButton'

// ─── Constants ──────────────────────────────────────────────────────────────

interface CreateTasksTableProps {
  onSave: (tasks: TaskRow[]) => void
  onBack: () => void
}

function createEmptyRow(): TaskRow {
  return {
    id: crypto.randomUUID(),
    title: '',
    deadlineType: null,
    dueDate: null,
    assigneeIds: [],
    assigneeDetails: {},
    notes: '',
    isImportant: false,
  }
}

// ─── Component ──────────────────────────────────────────────────────────────

function CreateTasksTable({ onSave, onBack }: CreateTasksTableProps) {
  const [rows, setRows] = useState<TaskRow[]>([createEmptyRow()])
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())

  function removeExpandedRow(id: string) {
    setExpandedRows((prev) => {
      const next = new Set(prev)
      next.delete(id)
      return next
    })
  }

  function updateRow(id: string, updates: Partial<TaskRow>) {
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

  function toggleRowExpansion(id: string) {
    setExpandedRows((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function deleteRow(id: string) {
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

  const hasAnyTask = rows.some((r) => r.title.trim())

  const meta: TaskTableMeta = { updateRow, expandedRows, toggleRowExpansion }


  return (
    <TableWrapper>
      <TableOuterContainer>
        <DataTable
          columns={columns}
          data={rows}
          getRowId={(row) => row.id}
          meta={meta}
          containerClassName="overflow-x-hidden"
          renderRowOverlay={(row) => (
            <TaskRowDeleteButton
              hasTitle={row.original.title.trim().length > 0}
              isLast={row.index === rows.length - 1}
              onDelete={() => deleteRow(row.original.id)}
            />
          )}
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
          שמור
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
  border: 0.5px solid rgba(0, 0, 0, 0.15);
  overflow-x: hidden;
  overflow-y: auto;
  box-shadow:
    0px 1px 2px rgba(0, 0, 0, 0.03),
    0px 1px 6px -1px rgba(0, 0, 0, 0.02),
    0px 2px 4px rgba(0, 0, 0, 0.02);

  table {
    border-collapse: collapse;
    table-layout: fixed;
  }

  th {
    height: 48px;
    padding: 12px;
    background: white;
    border-right: 0.5px solid rgba(0, 0, 0, 0.15);
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
      background: #fafafa;
    }

    &:last-of-type td{
    border-bottom: none;
    }
  }

  td {
    height: 44px;
    padding: 0px 12px;
    background: white;
    border: 0.5px solid rgba(0, 0, 0, 0.15);
    vertical-align: middle;

    &:first-of-type {
      border-right: none;
    }

    &:focus-within {
      outline: 1px solid #4096ff;
      outline-offset: -2px;
    }
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
  background: linear-gradient(162deg, #6866ff 0%, #7604c8 100%);
  color: white;
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
    box-shadow: inset 0px 2px 4px rgba(0, 0, 0, 0.05);
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
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  background: white;
  color: rgba(0, 0, 0, 0.88);
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
    box-shadow: inset 0px 2px 4px rgba(0, 0, 0, 0.05);
    pointer-events: none;
  }

  &:hover {
    border-color: #4096ff;
    color: #4096ff;
  }
`
