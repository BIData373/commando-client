import { createFileRoute, useNavigate } from "@tanstack/react-router"
import type { ColumnDef } from "@tanstack/react-table"
import type { TaskRowWithWorkspaceDto } from "src/api/model"
import { PersonalSectionDropdown } from "src/components/Personal/PersonalSectionDropdown"
import PersonalTaskTable from "src/components/Personal/PersonalTaskTable"
import { DropdownSection } from "src/components/shared/ArchiveDropdown"
import { DateText } from "src/components/shared/DateText"
import { ColumnHeaderWithActions } from "src/components/Tasks/ColumnHeaderWithActions"
import { formatDateShort } from "src/functions/date-utils"
import { TasksView } from "src/routes/workspace/$urlName/tasks"
import {
	ARCHIVE_DEFAULT_HIDDEN,
	COLUMN_LABELS,
	PERSONAL_ARCHIVED_COLUMN_META,
	TASK_COLUMN_ID,
} from "src/utils/task-table-utils"
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

const PERSONAL_ARCHIVE_DEFAULT_COLUMN_ORDER: (keyof TaskRowWithWorkspaceDto)[] =
	[
		TASK_COLUMN_ID.title,
		TASK_COLUMN_ID.status,
		TASK_COLUMN_ID.assignee,
		TASK_COLUMN_ID.deadlineType,
		TASK_COLUMN_ID.source,
		TASK_COLUMN_ID.workspace,
		TASK_COLUMN_ID.personalArchivedAt,
		TASK_COLUMN_ID.lastMessage,
		TASK_COLUMN_ID.createdAt,
		TASK_COLUMN_ID.tags,
		TASK_COLUMN_ID.notes,
		TASK_COLUMN_ID.updatedAt,
	]

const ARCHIVE_EXTRA_COLUMNS = [
	{
		id: TASK_COLUMN_ID.personalArchivedAt,
		header: ({ column }) => (
			<ColumnHeaderWithActions
				label={COLUMN_LABELS.personalArchivedAt}
				column={column}
			/>
		),
		size: 140,
		enableColumnFilter: false,
		accessorFn: (row) => row.personalArchivedAt,
		cell: ({
			row: {
				original: { personalArchivedAt },
			},
		}) => (
			<DateText>
				{personalArchivedAt && formatDateShort(personalArchivedAt)}
			</DateText>
		),
	},
] as ColumnDef<TaskRowWithWorkspaceDto>[]

function PersonalArchivePage() {
	const navigate = useNavigate()

	function handleOpenTask(taskId: number) {
		navigate({
			to: "/personal/archive/$taskId",
			params: { taskId: String(taskId) },
			search: { view: TasksView.TABLE },
		})
	}

	function handleAddComment(taskId: number) {
		navigate({
			to: "/personal/archive/$taskId",
			params: { taskId: String(taskId) },
			search: { view: TasksView.TABLE, focusComment: true },
		})
	}

	return (
		<UserViewProvider
			defaultColumnOrder={PERSONAL_ARCHIVE_DEFAULT_COLUMN_ORDER}
			defaultHiddenColumns={ARCHIVE_DEFAULT_HIDDEN}
		>
			<TasksFiltersProvider>
				<PersonalSectionDropdown current={DropdownSection.ARCHIVE} />
				<PersonalTaskTable
					filePrefix="ארכיון אישי"
					onOpenTask={handleOpenTask}
					isArchived={true}
					extraColumnsMeta={PERSONAL_ARCHIVED_COLUMN_META}
					extraColumns={ARCHIVE_EXTRA_COLUMNS}
					onAddComment={handleAddComment}
				/>
			</TasksFiltersProvider>
		</UserViewProvider>
	)
}
