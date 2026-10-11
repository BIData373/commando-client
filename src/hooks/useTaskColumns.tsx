import { type ColumnDef, createColumnHelper } from "@tanstack/react-table"
import { useMemo } from "react"
import type { TaskRowDto } from "src/api/model"
import type { AppTableFeatures } from "src/utils/table-features"
import {
	COLUMN_LABELS,
	createTaskColumnDefinitions,
	EMPTY_LIST,
	EMPTY_SET,
	TASK_COLUMN_ID,
} from "src/utils/task-table-utils"
import { ActionsCell } from "../components/Tasks/cells/ActionsCell"
import { AssigneesCell } from "../components/Tasks/cells/AssigneesCell"
import { DateCell } from "../components/Tasks/cells/DateCell"
import { DeadlineCell } from "../components/Tasks/cells/DeadlineCell"
import { LastMessageCell } from "../components/Tasks/cells/LastMessageCell"
import { NotesCell } from "../components/Tasks/cells/NotesCell"
import { SelectAllHeader } from "../components/Tasks/cells/SelectAllHeader"
import { SelectCell } from "../components/Tasks/cells/SelectCell"
import { SerialIdCell } from "../components/Tasks/cells/SerialIdCell"
import { SourceCell } from "../components/Tasks/cells/SourceCell"
import { StatusCell } from "../components/Tasks/cells/StatusCell"
import { TagsCell } from "../components/Tasks/cells/TagsCell"
import { TaskColumnHeader } from "../components/Tasks/cells/TaskColumnHeader"
import { TitleCell } from "../components/Tasks/cells/TitleCell"

interface UseTaskColumnsOptions<TTask extends TaskRowDto> {
	columnOrder: (keyof TTask)[]
	hiddenColumns?: Set<keyof TTask>
	extraColumns?: ColumnDef<AppTableFeatures, TTask>[]
	selectable?: boolean
	showMenuColumn?: boolean
}

/**
 * Cells and headers are module-level components reading per-render data from
 * `TaskTableProvider`. `flexRender` treats each `cell` function as a component type,
 * so recreating them would remount every visible cell.
 */
export function useTaskColumns<TTask extends TaskRowDto>({
	columnOrder,
	hiddenColumns = EMPTY_SET,
	extraColumns = EMPTY_LIST,
	selectable = false,
	showMenuColumn = true,
}: UseTaskColumnsOptions<TTask>) {
	const columns = useMemo(() => {
		const columnHelper = createColumnHelper<AppTableFeatures, TTask>()
		const definitions = createTaskColumnDefinitions<TTask>()

		const pinnedStartColumn = selectable
			? columnHelper.display({
					id: TASK_COLUMN_ID.select,
					size: 61,
					enableSorting: false,
					enableColumnFilter: false,
					header: SelectAllHeader,
					cell: SelectCell,
				})
			: columnHelper.accessor((row) => row.serialId, {
					id: TASK_COLUMN_ID.serialId,
					header: TaskColumnHeader,
					size: 70,
					enableColumnFilter: false,
					spanRows: ({ anchorRow, row }) =>
						anchorRow.original.id === row.original.id,
					cell: SerialIdCell,
				})

		const pinnedEndColumns = showMenuColumn
			? [
					columnHelper.display({
						id: TASK_COLUMN_ID.actions,
						size: 45,
						enableSorting: false,
						enableColumnFilter: false,
						cell: ActionsCell,
					}),
				]
			: []

		const middleColumns = columnHelper.columns([
			columnHelper.accessor((row) => row.title, {
				id: TASK_COLUMN_ID.title,
				header: COLUMN_LABELS.title,
				size: 300,
				minSize: 160,
				meta: { grow: true },
				enableSorting: false,
				enableColumnFilter: false,
				cell: TitleCell,
			}),
			definitions.status({
				header: TaskColumnHeader,
				size: 100,
				cell: StatusCell,
			}),
			definitions.assignee({
				header: TaskColumnHeader,
				size: 100,
				cell: AssigneesCell,
			}),
			definitions.deadlineType({
				header: TaskColumnHeader,
				size: 150,
				cell: DeadlineCell,
			}),
			definitions.source({
				header: TaskColumnHeader,
				size: 240,
				cell: SourceCell,
			}),
			columnHelper.display({
				id: TASK_COLUMN_ID.lastMessage,
				header: TaskColumnHeader,
				size: 100,
				minSize: 70,
				meta: { grow: true },
				enableSorting: false,
				enableColumnFilter: false,
				cell: LastMessageCell,
			}),
			definitions.tags({
				header: TaskColumnHeader,
				size: 100,
				minSize: 70,
				enableSorting: false,
				meta: { grow: true },
				cell: TagsCell,
			}),
			columnHelper.accessor((row) => row.notes, {
				id: TASK_COLUMN_ID.notes,
				header: COLUMN_LABELS.notes,
				size: 100,
				minSize: 100,
				enableSorting: false,
				enableColumnFilter: false,
				meta: { grow: true },
				cell: NotesCell,
			}),
			definitions.createdAt({
				header: TaskColumnHeader,
				size: 120,
				enableColumnFilter: false,
				cell: DateCell,
			}),
			definitions.updatedAt({
				header: TaskColumnHeader,
				size: 100,
				enableColumnFilter: false,
				cell: DateCell,
			}),
		])

		const columnsById = new Map(
			[...middleColumns, ...extraColumns].map((column) => [column.id, column]),
		)

		const orderedColumns = columnOrder
			.filter((id) => !hiddenColumns.has(id))
			.map((id) => columnsById.get(id as string))
			.filter((column) => column !== undefined)

		return columnHelper.columns([
			pinnedStartColumn,
			...orderedColumns,
			...pinnedEndColumns,
		])
	}, [columnOrder, hiddenColumns, extraColumns, selectable, showMenuColumn])

	return { columns }
}
