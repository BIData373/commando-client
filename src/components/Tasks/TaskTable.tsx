import styled from "@emotion/styled"
import type {
	ColumnDef,
	ColumnFiltersState,
	RowSelectionState,
} from "@tanstack/react-table"
import type React from "react"
import { useMemo, useState } from "react"
import { useUpsertAssigneeTaskStatus } from "src/api/assignee-task-status/assignee-task-status"
import type {
	DeadlineType,
	TaskRowDto,
	WorkspaceStatusDto,
	WorkspaceStatusType,
} from "src/api/model"
import { PermissionType } from "src/api/model"
import { useDeleteTask } from "src/api/task/task"
import { buildFilterOptionsMap } from "src/functions/filter-utils"
import { type TaskArchiveEntry, useTaskColumns } from "src/hooks/useTaskColumns"
import { useTasksFilters } from "src/providers/TasksFiltersProvider"
import { getEmptyState } from "src/utils/empty-state-utils"
import {
	DISABLED_CLICK_COLUMNS,
	HAS_ASSIGNEE_DATA_ATTR,
	TASK_ROW_ID_SEPARATOR,
} from "src/utils/task-table-utils"
import { EmptyCardState } from "../shared/EmptyCardState"
import { DataTable } from "../ui/data-table"
import { BulkActionsBar } from "./BulkActionsBar"
import { RowContextMenu } from "./RowContextMenu"

interface TaskTableProps<TTask extends TaskRowDto> {
	tasks: TTask[]
	getPermissionType(task?: TTask): PermissionType | null | undefined
	columnOrder: (keyof TTask)[]
	hiddenColumns: Set<keyof TTask>
	statuses?: WorkspaceStatusDto[]
	onEdit?: (taskId: number) => void
	onClick?: (taskId: number) => void
	extraColumns?: ColumnDef<TTask>[]
	showHeader?: boolean
	statusFilter?: WorkspaceStatusType[]
	deadlineTypeFilter?: DeadlineType[]
	onFiltersChange?: (
		statusFilter: WorkspaceStatusType[],
		deadlineTypeFilter: DeadlineType[],
	) => void
	isLoading?: boolean
	hideStatusAction?: boolean
	showActionsColumn?: boolean
	onArchive?: (tasks: TaskArchiveEntry[]) => void
	onUnarchive?: (tasks: TaskArchiveEntry[]) => void
	onChangeSuccess?(): void
}

function TaskTable<TTask extends TaskRowDto>({
	tasks,
	getPermissionType,
	columnOrder,
	hiddenColumns,
	statuses,
	onEdit,
	onClick,
	extraColumns = [],
	showHeader = true,
	statusFilter = [],
	deadlineTypeFilter = [],
	onFiltersChange,
	onChangeSuccess,
	isLoading,
	hideStatusAction = false,
	showActionsColumn = true,
	onArchive,
	onUnarchive,
}: TaskTableProps<TTask>) {
	const {
		searchQuery,
		activeQuickFilters,
		dateRange,
		sorting,
		setSorting,
		columnsFilters,
		setColumnsFilters,
	} = useTasksFilters()

	const { mutate: deleteTaskMutate } = useDeleteTask({
		mutation: { onSuccess: onChangeSuccess },
	})

	const { mutate: upsertStatus } = useUpsertAssigneeTaskStatus({
		mutation: { onSuccess: onChangeSuccess },
	})

	const [selectMode, setSelectMode] = useState(false)
	const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
	const [contextMenu, setContextMenu] = useState<{
		task: TTask
		x: number
		y: number
	} | null>(null)

	const urlColumnFilters: ColumnFiltersState = useMemo(
		() => [
			...(statusFilter.length ? [{ id: "status", value: statusFilter }] : []),
			...(deadlineTypeFilter.length
				? [{ id: "deadlineType", value: deadlineTypeFilter }]
				: []),
		],
		[statusFilter, deadlineTypeFilter],
	)

	const columnFilters: ColumnFiltersState = useMemo(
		() => [...urlColumnFilters, ...columnsFilters],
		[urlColumnFilters, columnsFilters],
	)

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

		const urlFilterIds = new Set(urlColumnFilters.map((f) => f.id))
		setColumnsFilters(newFilters.filter((f) => !urlFilterIds.has(f.id)))

		onFiltersChange?.(tableStatusColumnValue, tableDeadlineColumnValue)
	}

	const selectedRowKeys = Object.keys(rowSelection).filter(
		(key) => rowSelection[key],
	)

	// FIX Seperate state?
	const selectedTaskIds = selectedRowKeys.map((key) =>
		Number(key.split(TASK_ROW_ID_SEPARATOR)[0]),
	)

	const bulkDeleteDisabled = selectedTaskIds.some(
		(id) =>
			getPermissionType(tasks.find((t) => t.id === id)) !==
			PermissionType.MANAGER,
	)

	const bulkStatusDisabled =
		selectedTaskIds.length === 0 ||
		selectedRowKeys.some(
			(rowKey) => !tasks.find((t) => t.rowKey === rowKey)?.editable,
		)

	function handleEnterSelectMode(rowKey: string) {
		setSelectMode(true)
		setRowSelection((prev) =>
			selectMode ? { ...prev, [rowKey]: true } : { [rowKey]: true },
		)
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

	function handleBulkArchive() {
		if (onArchive) {
			onArchive(
				selectedTaskIds.map((id) => ({
					id,
					assigneeId: tasks.find((t) => t.id === id)?.assignee?.id,
				})),
			)
		} else {
			removeTasks(selectedTaskIds)
		}
		handleExitSelectMode()
	}

	function handleBulkDelete() {
		removeTasks(selectedTaskIds)
		handleExitSelectMode()
	}

	function bulkUpdateStatus(rowKeys: string[], status: WorkspaceStatusDto) {
		rowKeys.forEach((rowKey) => {
			const task = tasks.find((t) => t.rowKey === rowKey)
			if (!task || !task.assignee) {
				return
			}

			upsertStatus({
				data: {
					taskId: task.id,
					assigneeId: task.assignee.id,
					statusId: status.id,
				},
			})
		})
	}

	const filterOptionsMap = useMemo(() => buildFilterOptionsMap(tasks), [tasks])

	const { columns } = useTaskColumns({
		columnOrder,
		hiddenColumns,
		extraColumns,
		onUpdateStatusSuccess: onChangeSuccess,
		searchQuery,
		filterOptionsMap,
		selectMode: {
			enabled: selectMode,
			tasks,
			selectedTaskIds,
			onSelectAll: handleSelectAll,
		},
		showMenuColumn: showActionsColumn,
		actions: {
			onEdit,
			onArchive,
			onUnarchive,
			onDelete: removeTasks,
			onEnterSelectMode: handleEnterSelectMode,
		},
	})

	function handleCellClick(row: { original: TTask }, columnId: string) {
		if (!DISABLED_CLICK_COLUMNS.has(columnId)) {
			onClick?.(row.original.id)
		}
	}

	function handleRowContextMenu(
		row: { original: TTask },
		event: React.MouseEvent,
	) {
		event.preventDefault()
		setContextMenu({
			task: row.original,
			x: event.clientX,
			y: event.clientY,
		})
	}

	function handleContextMenuOpenChange(open: boolean) {
		if (!open) setContextMenu(null)
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
					onColumnFiltersChange={handleColumnFiltersChange}
					sorting={sorting}
					onSortingChange={setSorting}
					getRowId={(row) => row.rowKey}
					highlightedRowIds={
						contextMenu ? new Set([contextMenu.task.rowKey]) : undefined
					}
					onCellClick={handleCellClick}
					onRowContextMenu={
						showActionsColumn ? handleRowContextMenu : undefined
					}
					showHeader={showHeader}
					isLoading={isLoading}
					emptyState={
						<EmptyCardState
							{...getEmptyState(
								activeQuickFilters,
								searchQuery,
								tasks.length > 0,
								dateRange,
							)}
						/>
					}
				/>
			</TableWrapper>
			<RowContextMenu
				task={contextMenu?.task ?? null}
				position={contextMenu ? { x: contextMenu.x, y: contextMenu.y } : null}
				onOpenChange={handleContextMenuOpenChange}
				onEdit={onEdit}
				onEnterSelect={handleEnterSelectMode}
				onDelete={(id) => removeTasks([id])}
			/>
			<BulkActionsBar
				isVisible={selectMode}
				selectedCount={selectedTaskIds.length}
				statuses={hideStatusAction ? undefined : statuses}
				onChangeStatus={(status) => bulkUpdateStatus(selectedRowKeys, status)}
				onArchive={handleBulkArchive}
				onDelete={handleBulkDelete}
				deleteDisabled={bulkDeleteDisabled}
				statusDisabled={bulkStatusDisabled}
				onExitSelect={handleExitSelectMode}
			/>
		</>
	)
}

export { TaskTable }

// ─── Table ────────────────────────────────────────────────────────────────────

const TableWrapper = styled.div`
  min-width: 0;
  width: 100%;
  max-height: 100%;
  box-sizing: border-box;
  direction: ltr;
  border-radius: 8px;
  border: 0.5px solid var(--Background-color-bg-text-active);
  background: var(--background);
  box-shadow: var(--card-shadow-default);
  overflow: hidden;

  [data-slot="table-container"] {
    overflow: auto;
    max-height: 100%;
    direction: ltr;
  }

  table {
    direction: rtl;
    width: 100%;
    table-layout: fixed;
  }

  tr {
    &:hover,
    &[data-highlighted],
    &:has([data-slot="dropdown-menu-trigger"][data-state="open"]) {
      background: var(--table-rows-bg-hover);
    }

    &:last-of-type td {
      border-bottom: none;
    }
  }

  th {
    position: sticky;
    top: 0;
    z-index: var(--z-dropdown);
    font-size: var(--fs-base);
    font-weight: 500;
    line-height: 24px;
    color: var(--text-color);
    height: 48px;
    white-space: nowrap;
    background: var(--background);
    border-right: 0.5px solid var(--Background-color-bg-text-active);
    box-shadow: inset 0 -0.5px 0 0 var(--Background-color-bg-text-active);
	cursor: default;

    &:first-of-type {
      border-right: none;
    }
  }

  td {
    position: relative;
    padding: 0 6px;
    height: 43px;
    max-height: 43px;
    vertical-align: middle;
    overflow: hidden;
    border: 0.5px solid var(--Background-color-bg-text-active);
	cursor: default;
	
    &:first-of-type {
      border-right: none;
    }

    &:last-of-type {
      border-left: none;
    }

    /* Status cell is interactive (opens dropdown) only when the row has an assignee */
    &[data-column-id="status"]:has([${HAS_ASSIGNEE_DATA_ATTR}]) {
      cursor: pointer;

      &:hover {
        background: var(--status-cell-bg-hover);
      }
    }
  }
`
