import styled from "@emotion/styled"
import { createFileRoute } from "@tanstack/react-router"
import type { ColumnDef } from "@tanstack/react-table"
import type { TaskRowDto, TaskRowWithWorkspaceDto } from "src/api/model"
import { ColumnHeaderWithActions } from "src/components/Tasks/ColumnHeaderWithActions"
import WorkspaceTaskTable from "src/components/Tasks/WorkspaceTaskTable"
import { formatDateShort } from "src/functions/date-utils"
import { TasksFiltersProvider } from "../../../providers/TasksFiltersProvider"
import { TasksView } from "./tasks"

export const Route = createFileRoute("/workspace/$urlName/archive")({
	component: WorkspaceArchivePage,
	staticData: {
		header: {
			user: true,
		},
	},
})

const ARCHIVE_DEFAULT_COLUMN_ORDER: (keyof TaskRowWithWorkspaceDto)[] = [
	"title",
	"status",
	"assignee",
	"deadlineType",
	"source",
	"workspace",
	"archivedAt",
	"createdAt",
	"tags",
	"notes",
	"updatedAt",
]

const ARCHIVE_DEFAULT_HIDDEN = new Set<keyof TaskRowWithWorkspaceDto>([
	"tags",
	"notes",
	"updatedAt",
])

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

function WorkspaceArchivePage() {
	const { urlName } = Route.useParams()
	const navigate = Route.useNavigate()

	function handleOpenTask(taskId: number) {
		navigate({
			to: "/workspace/$urlName/archive/task/$taskId",
			params: { urlName, taskId: String(taskId) },
			search: { view: TasksView.TABLE },
		})
	}

	return (
		<TasksFiltersProvider
			storageKey="workspace-archive"
			defaultColumnOrder={ARCHIVE_DEFAULT_COLUMN_ORDER}
			defaultHiddenColumns={ARCHIVE_DEFAULT_HIDDEN}
		>
			<WorkspaceTaskTable
				onOpenTask={handleOpenTask}
				isArchived={true}
				extraColumns={ARCHIVE_EXTRA_COLUMNS}
				extraColumnsMeta={[{ id: "archivedAt", label: "הועבר לארכיון" }]}
			/>
		</TasksFiltersProvider>
	)
}

const DateCell = styled.span`
  font-size: var(--fs-sm);
  color: var(--sea-ink-soft);
  padding-inline: 6px;
`
