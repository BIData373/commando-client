import styled from "@emotion/styled"
import type { ColumnDef } from "@tanstack/react-table"
import type { TaskRowWithWorkspaceDto } from "src/api/model"
import { formatDateShort } from "src/functions/date-utils"
import { ColumnHeaderWithActions } from "../Tasks/ColumnHeaderWithActions"
import PersonalTasksLayout from "./PersonalTasksLayout"

const ARCHIVE_EXTRA_COLUMNS: ColumnDef<TaskRowWithWorkspaceDto>[] = [
	{
		id: "archivedAt",
		header: ({ column }) => (
			<ColumnHeaderWithActions label="הועבר לארכיון" column={column} />
		),
		size: 140,
		enableColumnFilter: false,
		accessorFn: (row) => row.archivedAt,
		cell: ({
			row: {
				original: { archivedAt },
			},
		}) => <DateCell>{archivedAt && formatDateShort(archivedAt)}</DateCell>,
	},
]

function PersonalArchiveLayout() {
	return (
		<PersonalTasksLayout
			isArchived={true}
			extraColumnsMeta={[{ id: "archivedAt", label: "הועבר לארכיון" }]}
			extraColumns={ARCHIVE_EXTRA_COLUMNS}
		/>
	)
}

export default PersonalArchiveLayout

const DateCell = styled.span`
  font-size: var(--fs-sm);
  color: var(--sea-ink-soft);
  padding-inline: 6px;
`
