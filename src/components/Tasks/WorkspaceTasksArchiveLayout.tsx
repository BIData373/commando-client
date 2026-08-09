import styled from "@emotion/styled"
import type { ColumnDef } from "@tanstack/react-table"
import { Route } from "lucide-react"
import type { TaskRowDto } from "src/api/model"
import { formatDateShort } from "src/functions/date-utils"
import { ColumnHeaderWithActions } from "./ColumnHeaderWithActions"
import TasksLayout from "./TasksLayout"

const ARCHIVE_EXTRA_COLUMNS: ColumnDef<TaskRowDto>[] = [
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
		}) => (
			<DateCell>{archivedAt && formatDateShort(new Date(archivedAt))}</DateCell>
		),
	},
]

interface WorkspaceTasksArchiveLayoutProps {
	urlName: string
}

function WorkspaceTasksArchiveLayout({
	urlName,
}: WorkspaceTasksArchiveLayoutProps) {
	return (
		<TasksLayout
			isArchived
			urlName={urlName}
			extraColumns={ARCHIVE_EXTRA_COLUMNS}
			extraColumnsMeta={[{ id: "archivedAt", label: "הועבר לארכיון" }]}
		/>
	)
}

export default WorkspaceTasksArchiveLayout

const DateCell = styled.span`
  font-size: var(--fs-sm);
  color: var(--sea-ink-soft);
  padding-inline: 6px;
`
