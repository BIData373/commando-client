import type { ColumnDef } from "@tanstack/react-table"
import { formatDateShort } from "src/functions/date-utils"
import { COLUMN_LABELS, TASK_COLUMN_ID } from "src/utils/task-table-utils"
import { DateText } from "../shared/DateText"
import { ColumnHeaderWithActions } from "./ColumnHeaderWithActions"

export const ARCHIVED_AT_COLUMN: ColumnDef<{ archivedAt?: Date }> = {
	id: TASK_COLUMN_ID.archivedAt,
	header: ({ column }) => (
		<ColumnHeaderWithActions label={COLUMN_LABELS.archivedAt} column={column} />
	),
	size: 140,
	enableColumnFilter: false,
	accessorFn: (row) => row.archivedAt,
	cell: ({
		row: {
			original: { archivedAt },
		},
	}) => (
		<DateText>{archivedAt && formatDateShort(new Date(archivedAt))}</DateText>
	),
}
