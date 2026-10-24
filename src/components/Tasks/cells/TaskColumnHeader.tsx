import type { HeaderContext } from "@tanstack/react-table"
import type { TaskRowDto, TaskRowWithWorkspaceDto } from "src/api/model"
import type { FilterOptions } from "src/functions/filter-utils"
import { useTaskTable } from "src/providers/TaskTableProvider"
import type { AppTableFeatures } from "src/utils/table-features"
import { COLUMN_LABELS } from "src/utils/task-table-utils"
import { ColumnHeaderWithActions } from "../ColumnHeaderWithActions"

export function TaskColumnHeader<TTask extends TaskRowDto, TValue>({
	column,
}: HeaderContext<AppTableFeatures, TTask, TValue>) {
	const { filterOptionsMap } = useTaskTable()

	return (
		<ColumnHeaderWithActions
			label={COLUMN_LABELS[column.id as keyof TaskRowWithWorkspaceDto]}
			column={column}
			filterOptions={filterOptionsMap?.[column.id as FilterOptions]}
		/>
	)
}
