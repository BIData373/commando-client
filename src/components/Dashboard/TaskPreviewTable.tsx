import { type ReactNode, useMemo } from "react"
import type { TaskRowDto } from "src/api/model"
import {
	DEFAULT_COLUMN_ORDER,
	DISABLED_CLICK_COLUMNS,
	groupRowsByTask,
	toHiddenColumns,
} from "src/utils/task-table-utils"
import { useTaskColumns } from "../../hooks/useTaskColumns"
import { DataTable } from "../ui/data-table"

interface TaskPreviewTableProps {
	tasks: TaskRowDto[]
	visibleColumns: (keyof TaskRowDto)[]
	onClick?(taskId: number): void
	emptyState: ReactNode
}

export function TaskPreviewTable({
	tasks,
	visibleColumns,
	onClick,
	emptyState,
}: TaskPreviewTableProps) {
	const { columns } = useTaskColumns<TaskRowDto>({
		columnOrder: DEFAULT_COLUMN_ORDER,
		hiddenColumns: toHiddenColumns(visibleColumns),
		showMenuColumn: false,
	})

	const groupedTasks = useMemo(() => groupRowsByTask(tasks), [tasks])

	function handleCellClick(row: { original: TaskRowDto }, columnId: string) {
		if (!DISABLED_CLICK_COLUMNS.has(columnId)) {
			onClick?.(row.original.id)
		}
	}

	return (
		<DataTable
			columns={columns}
			data={groupedTasks}
			showHeader={false}
			emptyState={emptyState}
			onCellClick={handleCellClick}
		/>
	)
}
