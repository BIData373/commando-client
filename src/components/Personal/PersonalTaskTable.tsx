import { useState } from 'react'
import styled from '@emotion/styled'
import { type ColumnDef, type ColumnFiltersState, type RowSelectionState, type SortingState } from '@tanstack/react-table'
import { DataTable } from '../ui/data-table'
import { BulkActionsBar } from '../Tasks/BulkActionsBar'
import { ColumnHeaderWithActions } from '../Tasks/ColumnHeaderWithActions'
import type { PersonalTask } from '../../data/PersonalTasks'
import type { DirectiveStatus } from '../shared/StatusTag'
import { type FilterOption } from '../../functions/filter-utils'
import { useTaskColumns, type TaskColumnId } from '../../hooks/useTaskColumns'
import type { Task } from '../../data/Tasks'

interface PersonalTaskTableProps {
  tasks: PersonalTask[]
  searchQuery: string
  columnOrder: string[]
  hiddenColumns: Set<string>
  filterOptionsMap: Record<string, FilterOption[]>
  onUpdateStatus: (taskId: number, status: DirectiveStatus) => void
  onBulkChangeStatus: (taskIds: number[], status: DirectiveStatus) => void
  onArchive: (taskIds: number[]) => void
  onDelete: (taskIds: number[]) => void
}

function PersonalTaskTable({
  tasks,
  searchQuery,
  columnOrder,
  hiddenColumns,
  filterOptionsMap,
  onUpdateStatus,
  onBulkChangeStatus,
  onArchive,
  onDelete,
}: PersonalTaskTableProps) {
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
    .filter((id) => !hiddenColumns.has(id) && id !== 'workspace') as TaskColumnId[]

  const { columns: baseColumns } = useTaskColumns({
    visibleColumns,
    searchQuery,
    filterOptionsMap,
    onUpdateStatus,
    selectMode: {
      enabled: selectMode,
      tasks: tasks as Task[],
      selectedTaskIds,
      onSelectAll: handleSelectAll,
    },
    actions: {
      onEdit: () => {},
      onArchive,
      onDelete,
      onEnterSelectMode: handleEnterSelectMode,
    },
  })

  const workspaceColumn: ColumnDef<PersonalTask> = {
    id: 'workspace',
    accessorFn: (row) => row.workspace.name,
    header: ({ column }) => <ColumnHeaderWithActions label="מפקד מנחה" column={column} />,
    size: 170,
    enableColumnFilter: false,
    sortingFn: (rowA, rowB) =>
      rowA.original.workspace.name.localeCompare(rowB.original.workspace.name, 'he'),
    cell: ({ row: { original: { workspace } } }) => (
      <WorkspaceCell>
        <WorkspaceIconImg src={workspace.iconUrl} alt={workspace.name} />
        <WorkspaceName>{workspace.name}</WorkspaceName>
      </WorkspaceCell>
    ),
  }

  const wsVisible = !hiddenColumns.has('workspace')
  const wsIndex = columnOrder.indexOf('workspace')

  const columns: ColumnDef<PersonalTask>[] = [...(baseColumns as ColumnDef<PersonalTask>[])]

  if (wsVisible && wsIndex !== -1) {
    const visibleBeforeWs = columnOrder
      .slice(0, wsIndex)
      .filter((id) => !hiddenColumns.has(id))
      .length

    const insertAt = selectMode ? visibleBeforeWs : visibleBeforeWs
    columns.splice(insertAt, 0, workspaceColumn)
  }

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

export { PersonalTaskTable }

const TableWrapper = styled.div`
  overflow: auto;
  direction: ltr;
  border-radius: 8px;

  & > * {
    direction: rtl;
  }
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

    &:last-of-type td {
      border-bottom: none;
    }
  }

  th {
    font-size: 16px;
    font-weight: 500;
    line-height: 24px;
    color: rgba(0, 0, 0, 0.65);
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

const WorkspaceCell = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: flex-start;
`

const WorkspaceName = styled.span`
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  color: rgba(0, 0, 0, 0.65);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const WorkspaceIconImg = styled.img`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
`
