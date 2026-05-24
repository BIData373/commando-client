import { useState } from 'react'
import styled from '@emotion/styled'
import { type ColumnFiltersState, type RowSelectionState, type SortingState } from '@tanstack/react-table'
import { DataTable } from '../ui/data-table'
import { BulkActionsBar } from './BulkActionsBar'
import type { Task } from '../../data/Tasks'
import { type FilterOption } from '../../functions/filter-utils'
import { useTaskColumns, type TaskColumnId } from '../../hooks/useTaskColumns'
import type { DirectiveStatus } from '#/utils/statusUtils'

interface TaskTableProps {
  tasks: Task[]
  searchQuery: string
  columnOrder: string[]
  hiddenColumns: Set<string>
  filterOptionsMap: Record<string, FilterOption[]>
  onUpdateStatus: (taskId: number, status: DirectiveStatus) => void
  onEdit: (taskId: number) => void
  onArchive: (taskIds: number[]) => void
  onDelete: (taskIds: number[]) => void
  onBulkChangeStatus: (taskIds: number[], status: DirectiveStatus) => void
  showHeader?: boolean
}

function TaskTable({
  tasks,
  searchQuery,
  columnOrder,
  hiddenColumns,
  filterOptionsMap,
  onUpdateStatus,
  onEdit,
  onArchive,
  onDelete,
  onBulkChangeStatus,
  showHeader = true,
}: TaskTableProps) {
  const [selectMode, setSelectMode] = useState(false)
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [sorting, setSorting] = useState<SortingState>([])

  const selectedTaskIds = Object.keys(rowSelection)
    .filter((key) => rowSelection[key])
    .map(Number)

  function handleEnterSelectMode(taskId?: number) {
    setSelectMode(true)
    setRowSelection(taskId !== undefined ? { [String(taskId)]: true } : {})
  }

  function handleExitSelectMode() {
    setSelectMode(false)
    setRowSelection({})
  }

  function handleSelectAll(checked: boolean) {
    if (checked) {
      const all: RowSelectionState = {}
      tasks.forEach((t) => { all[String(t.id)] = true })
      setRowSelection(all)
    } else {
      setRowSelection({})
    }
  }

  const visibleColumns = columnOrder
    .filter((id) => !hiddenColumns.has(id)) as TaskColumnId[]

  const { columns } = useTaskColumns({
    visibleColumns,
    searchQuery,
    filterOptionsMap,
    onUpdateStatus,
    selectMode: {
      enabled: selectMode,
      tasks,
      selectedTaskIds,
      onSelectAll: handleSelectAll,
    },
    actions: {
      onEdit,
      onArchive,
      onDelete,
      onEnterSelectMode: handleEnterSelectMode,
    },
  })

  return (
    <>
      <TableWrapper>
        <DataTable
          columns={columns}
          data={tasks}
          rowSelection={selectMode ? rowSelection : undefined}
          onRowSelectionChange={selectMode ? setRowSelection : undefined}
          columnFilters={columnFilters}
          onColumnFiltersChange={setColumnFilters}
          sorting={sorting}
          onSortingChange={setSorting}
          getRowId={(row) => String(row.id)}
          showHeader={showHeader}
        />
      </TableWrapper>
      {selectMode && (
        <BulkActionsBar
          selectedCount={selectedTaskIds.length}
          onChangeStatus={(status) => onBulkChangeStatus(selectedTaskIds, status)}
          onArchive={() => {
            onArchive(selectedTaskIds)
            handleExitSelectMode()
          }}
          onDelete={() => {
            onDelete(selectedTaskIds)
            handleExitSelectMode()
          }}
          onExitSelect={handleExitSelectMode}
        />
      )}
    </>
  )
}

export { TaskTable }

// ─── Table ────────────────────────────────────────────────────────────────────

const TableWrapper = styled.div`
  overflow-x: auto;
  border-radius: 8px;
  border: 0.5px solid rgba(0, 0, 0, 0.15);
  background: white;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02);

  table {
    width: 100%;
    table-layout: fixed;
  }

  tr {
    &:hover {
      background: var(--link-bg-hover);
    }

    &:last-of-type td{
      border-bottom: none;
    }
  }

  th {
    font-size: 16px;
    font-weight: 500;
    line-height: 24px;
    color:rgba(0, 0, 0, 0.65);
    height: 48px;
    white-space: nowrap;
    background: white;
    border-right: 0.5px solid rgba(0, 0, 0, 0.15);

    &:first-of-type {
      border-right: none;
    }
  }

  td {
    padding: 0 6px;
    height: 43px;
    max-height: 43px;
    vertical-align: middle;
    overflow: hidden;
    border: 0.5px solid rgba(0, 0, 0, 0.15);

    &:first-of-type {
      border-right: none;
    }

    &:last-of-type {
      border-left: none;
    }
  }
`