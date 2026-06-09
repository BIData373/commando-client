import styled from "@emotion/styled"
import type { QueryKey } from "@tanstack/react-query"
import { useQueryClient } from "@tanstack/react-query"
import type {
	ColumnDef,
	ColumnFiltersState,
	RowSelectionState,
	SortingState,
} from "@tanstack/react-table"
import type React from "react"
import { useMemo, useState } from "react"
import { useUpsertAssigneeTaskStatus } from "src/api/assignee-task-status/assignee-task-status"
import type {
	DeadlineType,
	WorkspaceStatusDto,
	WorkspaceStatusType,
} from "src/api/model"
import { useDeleteTask } from "src/api/task/task"
import {
	TASK_ROW_ID_SEPARATOR,
	type TaskRow,
	useTasksFilters,
} from "src/providers/TasksFiltersProvider"
import { buildFilterOptionsMap } from "../../functions/filter-utils"
import { type TaskColumn, useTaskColumns } from "../../hooks/useTaskColumns"
import { DataTable } from "../ui/data-table"
import { BulkActionsBar } from "./BulkActionsBar"

interface TaskTableProps {
	queryKey: QueryKey
	tasks: TaskRow[]
	onEdit?: (taskId: number) => void
	onDoubleClick?: (taskId: number) => void
	extraColumns?: Record<string, ColumnDef<TaskRow>>
	showHeader?: boolean
	statusFilter?: WorkspaceStatusType[]
	deadlineTypeFilter?: DeadlineType[]
	onFiltersChange?: (
		statusFilter: WorkspaceStatusType[],
		deadlineTypeFilter: DeadlineType[],
	) => void
}

function TaskTable({
	queryKey,
	tasks,
	onEdit = () => {},
	onDoubleClick,
	extraColumns,
	showHeader = true,
	statusFilter = [],
	deadlineTypeFilter = [],
	onFiltersChange,
}: TaskTableProps) {
	const { searchQuery, columnOrder, hiddenColumns } = useTasksFilters()
	const queryClient = useQueryClient()

	function handleSuccess() {
		queryClient.invalidateQueries({ queryKey })
	}

	const { mutate: deleteTaskMutate } = useDeleteTask({
		mutation: { onSuccess: handleSuccess },
	})

	const { mutate: upsertStatus } = useUpsertAssigneeTaskStatus({
		mutation: { onSuccess: handleSuccess },
	})

	const [selectMode, setSelectMode] = useState(false)
	const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
	const urlColumnFilters: ColumnFiltersState = [
		...(statusFilter.length ? [{ id: "status", value: statusFilter }] : []),
		...(deadlineTypeFilter.length
			? [{ id: "deadlineType", value: deadlineTypeFilter }]
			: []),
	]
	const [localColumnFilters, setLocalColumnFilters] =
		useState<ColumnFiltersState>([])
	const columnFilters: ColumnFiltersState = [
		...urlColumnFilters,
		...localColumnFilters,
	]

	function getColumnFilter(columnFilters: ColumnFiltersState, id: string) {
		return columnFilters.find((column) => column.id === id)?.value ?? []
	}

	function handleColumnFiltersChange(
		updater: React.SetStateAction<ColumnFiltersState>,
	) {
		const newFilters =
			typeof updater === "function" ? updater(columnFilters) : updater

		const tableStatusColumnValue = getColumnFilter(
			newFilters,
			"status",
		) as WorkspaceStatusType[]
		const tableDeadlineColumnValue = getColumnFilter(
			newFilters,
			"deadlineType",
		) as DeadlineType[]

		const tableTabFilter = newFilters.filter(
			(column) => column.id !== "status" && column.value !== "deadlineType",
		)
		setLocalColumnFilters(tableTabFilter)

		onFiltersChange?.(tableStatusColumnValue, tableDeadlineColumnValue)
	}
	const [sorting, setSorting] = useState<SortingState>([])

	const selectedTaskIds = Object.keys(rowSelection)
		.filter((key) => rowSelection[key])
		.map((key) => Number(key.split(TASK_ROW_ID_SEPARATOR)[0]))

	function handleEnterSelectMode(taskId?: number) {
		setSelectMode(true)
		const task = tasks.find((t) => t.id === taskId)
		setRowSelection(task ? { [task.rowKey]: true } : {})
	}

	function handleExitSelectMode() {
		setSelectMode(false)
		setRowSelection({})
	}

	function handleSelectAll(checked: boolean) {
		if (checked) {
			const all: RowSelectionState = {}
			tasks.forEach((t) => {
				all[t.rowKey] = true
			})
			setRowSelection(all)
		} else {
			setRowSelection({})
		}
	}

	function removeTasks(taskIds: number[]) {
		// TODO - maybe await Promise.all
		taskIds.forEach((id) => {
			deleteTaskMutate({ pathParams: { id } })
		})
	}

	function bulkUpdateStatus(taskIds: number[], status: WorkspaceStatusDto) {
		taskIds.forEach((id) => {
			const task = tasks.find((t) => t.id === id)
			if (!task || !task.assignee) {
				return
			}

			upsertStatus({
				data: { taskId: id, assigneeId: task.assignee.id, statusId: status.id },
			})
		})
	}

	const filterOptionsMap = useMemo(() => buildFilterOptionsMap(tasks), [tasks])

	const extraColumnIds = extraColumns
		? new Set(Object.keys(extraColumns))
		: new Set<string>()

	const visibleColumns = columnOrder.filter(
		(id) => !hiddenColumns.has(id) && !extraColumnIds.has(id),
	) as TaskColumn[]

	const { columns: baseColumns } = useTaskColumns({
		queryKey,
		visibleColumns,
		searchQuery,
		filterOptionsMap,
		selectMode: {
			enabled: selectMode,
			tasks,
			selectedTaskIds,
			onSelectAll: handleSelectAll,
		},
		actions: {
			onEdit,
			onDoubleClick,
			onArchive: removeTasks,
			onDelete: removeTasks,
			onEnterSelectMode: handleEnterSelectMode,
		},
	})

	const columns = useMemo(() => {
		const result = [...baseColumns]

		if (extraColumns) {
			for (const [id, colDef] of Object.entries(extraColumns)) {
				const colId = id as TaskColumn
				const isVisible = !hiddenColumns.has(colId)
				const orderIndex = columnOrder.indexOf(colId)
				if (!isVisible || orderIndex === -1) continue

				const visibleBeforeCount = columnOrder
					.slice(0, orderIndex)
					.filter((colId) => !hiddenColumns.has(colId)).length

				result.splice(visibleBeforeCount, 0, colDef as ColumnDef<TaskRow>)
			}
		}

		return result
	}, [baseColumns, extraColumns, columnOrder, hiddenColumns])

	return (
		<>
			<TableWrapper>
				<DataTable
					columns={columns}
					data={tasks}
					rowSelection={selectMode ? rowSelection : undefined}
					onRowSelectionChange={selectMode ? setRowSelection : undefined}
					columnFilters={columnFilters}
					onColumnFiltersChange={handleColumnFiltersChange}
					sorting={sorting}
					onSortingChange={setSorting}
					getRowId={(row) => row.rowKey}
					showHeader={showHeader}
				/>
			</TableWrapper>
			{selectMode && (
				<BulkActionsBar
					selectedCount={selectedTaskIds.length}
					onChangeStatus={(status) => bulkUpdateStatus(selectedTaskIds, status)}
					onArchive={() => {
						removeTasks(selectedTaskIds)
						handleExitSelectMode()
					}}
					onDelete={() => {
						removeTasks(selectedTaskIds)
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
  overflow-y: auto;
  min-width: 0;
  width: 100%;
  max-height: 100%;
  box-sizing: border-box;
  direction: ltr;
  border-radius: 8px;
  border: 0.5px solid var(--Background-color-bg-text-active);
  background: var(--background);
  box-shadow: var(--card-shadow-default);

  [data-slot="table-container"] {
    overflow-x: auto;
    direction: rtl;
  }

  table {
    direction: rtl;
    min-width: 100%;
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
    position: sticky;
    top: 0;
    z-index: var(--z-dropdown);
    font-size: 16px;
    font-weight: 500;
    line-height: 24px;
    color: var(--text-color);
    height: 48px;
    white-space: nowrap;
    background: var(--background);
    border-right: 0.5px solid var(--Background-color-bg-text-active);

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
    border: 0.5px solid var(--Background-color-bg-text-active);

    &:first-of-type {
      border-right: none;
    }

    &:last-of-type {
      border-left: none;
    }
  }
`
