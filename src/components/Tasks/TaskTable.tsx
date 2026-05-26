import styled from "@emotion/styled";
import type {
	ColumnDef,
	ColumnFiltersState,
	RowSelectionState,
	SortingState,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import type { DirectiveStatus } from "src/utils/statusUtils";
import type { Task } from "../../data/Tasks";
import { buildFilterOptionsMap } from "../../functions/filter-utils";
import { type TaskColumn, useTaskColumns } from "../../hooks/useTaskColumns";
import { useTasks } from "../../providers/TasksProvider";
import { DataTable } from "../ui/data-table";
import { BulkActionsBar } from "./BulkActionsBar";

interface TaskTableProps {
	tasks: Task[];
	onEdit?: (taskId: number) => void;
	onDoubleClick?: (taskId: number) => void;
	extraColumns?: Record<string, ColumnDef<Task>>;
	showHeader?: boolean;
	initialStatusFilter?: DirectiveStatus;
}

function TaskTable({
	tasks,
	onEdit = () => {},
	onDoubleClick,
	extraColumns,
	showHeader = true,
	initialStatusFilter,
}: TaskTableProps) {
	const {
		searchQuery,
		columnOrder,
		hiddenColumns,
		updateTaskStatus,
		removeTasks,
		bulkUpdateStatus,
	} = useTasks();
	const [selectMode, setSelectMode] = useState(false);
	const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
		initialStatusFilter ? [{ id: "status", value: [initialStatusFilter] }] : [],
	);
	const [sorting, setSorting] = useState<SortingState>([]);

	const selectedTaskIds = Object.keys(rowSelection)
		.filter((key) => rowSelection[key])
		.map(Number);

	function handleEnterSelectMode(taskId?: number) {
		setSelectMode(true);
		setRowSelection(taskId !== undefined ? { [String(taskId)]: true } : {});
	}

	function handleExitSelectMode() {
		setSelectMode(false);
		setRowSelection({});
	}

	function handleSelectAll(checked: boolean) {
		if (checked) {
			const all: RowSelectionState = {};
			tasks.forEach((t) => {
				all[String(t.id)] = true;
			});
			setRowSelection(all);
		} else {
			setRowSelection({});
		}
	}

	const filterOptionsMap = useMemo(() => buildFilterOptionsMap(tasks), [tasks]);

	const extraColumnIds = extraColumns
		? new Set(Object.keys(extraColumns))
		: new Set<string>();

	const visibleColumns = columnOrder.filter(
		(id) => !hiddenColumns.has(id) && !extraColumnIds.has(id),
	) as TaskColumn[];

	const { columns: baseColumns } = useTaskColumns({
		visibleColumns,
		searchQuery,
		filterOptionsMap,
		onUpdateStatus: updateTaskStatus,
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
	});

	const columns = useMemo(() => {
		const result = [...baseColumns];

		if (extraColumns) {
			for (const [id, colDef] of Object.entries(extraColumns)) {
				const colId = id as TaskColumn;
				const isVisible = !hiddenColumns.has(colId);
				const orderIndex = columnOrder.indexOf(colId);
				if (!isVisible || orderIndex === -1) continue;

				const visibleBeforeCount = columnOrder
					.slice(0, orderIndex)
					.filter((colId) => !hiddenColumns.has(colId)).length;

				result.splice(visibleBeforeCount, 0, colDef as ColumnDef<Task>);
			}
		}

		return result;
	}, [baseColumns, extraColumns, columnOrder, hiddenColumns]);

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
					onChangeStatus={(status) => bulkUpdateStatus(selectedTaskIds, status)}
					onArchive={() => {
						removeTasks(selectedTaskIds);
						handleExitSelectMode();
					}}
					onDelete={() => {
						removeTasks(selectedTaskIds);
						handleExitSelectMode();
					}}
					onExitSelect={handleExitSelectMode}
				/>
			)}
		</>
	);
}

export { TaskTable };

// ─── Table ────────────────────────────────────────────────────────────────────

const TableWrapper = styled.div`
  overflow: auto;
  direction: ltr;
  border-radius: 8px;

  & > * {
    direction: rtl;
  }
  border: 0.5px solid var(--Background-color-bg-text-active);
  background: var(--background);
  box-shadow: var(--card-shadow-default);

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
`;
