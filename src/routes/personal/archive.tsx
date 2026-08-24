import styled from "@emotion/styled"
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import type { ColumnDef } from "@tanstack/react-table"
import type { TaskRowWithWorkspaceDto } from "src/api/model"
import { PersonalSectionDropdown } from "src/components/Personal/PersonalSectionDropdown"
import PersonalTaskTable from "src/components/Personal/PersonalTaskTable"
import { DropdownSection } from "src/components/shared/ArchiveDropdown"
import { ColumnHeaderWithActions } from "src/components/Tasks/ColumnHeaderWithActions"
import { formatDateShort } from "src/functions/date-utils"
import { TasksView } from "src/routes/workspace/$urlName/tasks"
import { COLUMN_LABELS, TASK_COLUMN_ID } from "src/utils/task-table-utils"
import { TasksFiltersProvider } from "../../providers/TasksFiltersProvider"
import { UserViewProvider } from "../../providers/UserViewProvider"

export const Route = createFileRoute("/personal/archive")({
	component: PersonalArchivePage,
	staticData: {
		header: {
			headerTitle: "ארכיון אישי",
			user: true,
		},
	},
})

const ARCHIVE_DEFAULT_COLUMN_ORDER: (keyof TaskRowWithWorkspaceDto)[] = [
	TASK_COLUMN_ID.title,
	TASK_COLUMN_ID.status,
	TASK_COLUMN_ID.assignee,
	TASK_COLUMN_ID.deadlineType,
	TASK_COLUMN_ID.source,
	TASK_COLUMN_ID.workspace,
	TASK_COLUMN_ID.archivedAt,
	TASK_COLUMN_ID.createdAt,
	TASK_COLUMN_ID.tags,
	TASK_COLUMN_ID.notes,
	TASK_COLUMN_ID.updatedAt,
]

const ARCHIVE_DEFAULT_HIDDEN = new Set<keyof TaskRowWithWorkspaceDto>([
	TASK_COLUMN_ID.tags,
	TASK_COLUMN_ID.notes,
	TASK_COLUMN_ID.updatedAt,
])

const ARCHIVE_EXTRA_COLUMNS: ColumnDef<TaskRowWithWorkspaceDto>[] = [
	{
		id: TASK_COLUMN_ID.archivedAt,
		header: ({ column }) => (
			<ColumnHeaderWithActions
				label={COLUMN_LABELS.archivedAt}
				column={column}
			/>
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

function PersonalArchivePage() {
	const navigate = useNavigate()

	function handleOpenTask(taskId: number) {
		navigate({
			to: "/personal/archive/task/$taskId",
			params: { taskId: String(taskId) },
			search: { view: TasksView.TABLE },
		})
	}

	return (
		<UserViewProvider
			defaultColumnOrder={ARCHIVE_DEFAULT_COLUMN_ORDER}
			defaultHiddenColumns={ARCHIVE_DEFAULT_HIDDEN}
		>
			<TasksFiltersProvider>
				<PersonalSectionDropdown current={DropdownSection.ARCHIVE} />
				<PersonalTaskTable
					filePrefix="ארכיון אישי"
					onOpenTask={handleOpenTask}
					isArchived={true}
					extraColumnsMeta={[
						{ id: TASK_COLUMN_ID.archivedAt, label: COLUMN_LABELS.archivedAt },
					]}
					extraColumns={ARCHIVE_EXTRA_COLUMNS}
				/>
			</TasksFiltersProvider>
		</UserViewProvider>
	)
}

const DateCell = styled.span`
  font-size: var(--fs-sm);
  color: var(--sea-ink-soft);
  padding-inline: 6px;
`
