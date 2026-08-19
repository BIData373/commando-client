import styled from "@emotion/styled"
import type { ColumnDef, ColumnFiltersState } from "@tanstack/react-table"
import { Download } from "lucide-react"
import { useCallback, useMemo } from "react"
import type { TaskRowDto } from "src/api/model"
import { exportTasksToExcel } from "src/functions/export-excel"
import { useTasksFilters } from "src/providers/TasksFiltersProvider"
import { buildCountingColumns } from "src/utils/task-table-utils"
import { useHeadlessTable } from "../../hooks/useHeadlessTable"

interface ExportButtonProps<TTask extends TaskRowDto> {
	tasks: TTask[]
	allColumnFilters: ColumnFiltersState
	columnOrder: (keyof TTask)[]
	hiddenColumns: Set<keyof TTask>
	extraColumns?: ColumnDef<TTask>[]
	exportFilePrefix?: string
	buildTaskUrl: (taskId: number) => string
}

function ExportButton<TTask extends TaskRowDto>({
	tasks,
	allColumnFilters,
	columnOrder,
	hiddenColumns,
	extraColumns = [],
	exportFilePrefix,
	buildTaskUrl,
}: ExportButtonProps<TTask>) {
	const { sorting } = useTasksFilters()

	const countingColumns = useMemo(
		() => buildCountingColumns(extraColumns),
		[extraColumns],
	)

	const exportTable = useHeadlessTable({
		data: tasks,
		columns: countingColumns,
		columnFilters: allColumnFilters,
		sorting,
	})

	const handleExport = useCallback(() => {
		const exportRows = exportTable
			.getSortedRowModel()
			.rows.map((row) => row.original)

		exportTasksToExcel(
			exportRows,
			columnOrder,
			hiddenColumns,
			buildTaskUrl,
			exportFilePrefix,
		)
	}, [exportTable, columnOrder, hiddenColumns, exportFilePrefix, buildTaskUrl])

	return (
		<ActionButton onClick={handleExport}>
			<Download size={18} />
		</ActionButton>
	)
}

export { ExportButton }

const ActionButton = styled.button`
  display: flex;
  padding: 0 15px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 8px;
  height: 40px;
  border-radius: 8px;
  border: 1px solid var(--card-border);
  background: var(--background);
  box-shadow: var(--shadow-button);
  cursor: pointer;
  white-space: nowrap;

  &:hover {
	background: var(--link-bg-hover);
  }
`
