import { createFileRoute } from "@tanstack/react-router"
import type { ColumnDef } from "@tanstack/react-table"
import type { TaskRowDto, TaskRowWithWorkspaceDto } from "src/api/model"
import { DropdownSection } from "src/components/shared/ArchiveDropdown"
import { DateText } from "src/components/shared/DateText"
import { ColumnHeaderWithActions } from "src/components/Tasks/ColumnHeaderWithActions"
import WorkspaceTaskTable from "src/components/Tasks/WorkspaceTaskTable"
import { WorkspaceTabs } from "src/components/WorkspaceTabs"
import { formatDateShort } from "src/functions/date-utils"
import { useWorkspace } from "src/providers/WorkspaceProvider"
import {
	ARCHIVE_DEFAULT_HIDDEN,
	COLUMN_LABELS,
	TASK_COLUMN_ID,
	WORKSPACE_ARCHIVED_COLUMN_META,
} from "src/utils/task-table-utils"
import { TasksFiltersProvider } from "../../../providers/TasksFiltersProvider"
import { UserViewProvider } from "../../../providers/UserViewProvider"
import { TasksView } from "./tasks"

export const Route = createFileRoute("/workspace/$urlName/archive")({
	component: WorkspaceArchivePage,
	staticData: {
		header: {
			user: true,
		},
	},
})

const WORKSPACE_ARCHIVE_DEFAULT_COLUMN_ORDER: (keyof TaskRowWithWorkspaceDto)[] =
	[
		TASK_COLUMN_ID.title,
		TASK_COLUMN_ID.status,
		TASK_COLUMN_ID.assignee,
		TASK_COLUMN_ID.deadlineType,
		TASK_COLUMN_ID.source,
		TASK_COLUMN_ID.workspace,
		TASK_COLUMN_ID.workspaceArchivedAt,
		TASK_COLUMN_ID.lastMessage,
		TASK_COLUMN_ID.createdAt,
		TASK_COLUMN_ID.tags,
		TASK_COLUMN_ID.notes,
		TASK_COLUMN_ID.updatedAt,
	]

const ARCHIVE_EXTRA_COLUMNS = [
	{
		id: TASK_COLUMN_ID.workspaceArchivedAt,
		header: ({ column }) => (
			<ColumnHeaderWithActions
				label={COLUMN_LABELS.workspaceArchivedAt}
				column={column}
			/>
		),
		size: 140,
		enableColumnFilter: false,
		accessorFn: (row) => row.workspaceArchivedAt,
		cell: ({
			row: {
				original: { workspaceArchivedAt },
			},
		}) => (
			<DateText>
				{workspaceArchivedAt && formatDateShort(workspaceArchivedAt)}
			</DateText>
		),
	},
] as ColumnDef<TaskRowDto>[]

function WorkspaceArchivePage() {
	const { urlName } = Route.useParams()
	const navigate = Route.useNavigate()
	const {
		workspace: { id: workspaceId },
	} = useWorkspace()

	function handleOpenTask(taskId: number) {
		navigate({
			to: "/workspace/$urlName/archive/$taskId",
			params: { urlName, taskId: String(taskId) },
			search: { view: TasksView.TABLE },
		})
	}

	return (
		<UserViewProvider
			workspaceId={workspaceId}
			defaultColumnOrder={WORKSPACE_ARCHIVE_DEFAULT_COLUMN_ORDER}
			defaultHiddenColumns={ARCHIVE_DEFAULT_HIDDEN}
		>
			<TasksFiltersProvider>
				<WorkspaceTabs section={DropdownSection.ARCHIVE} />
				<WorkspaceTaskTable
					onOpenTask={handleOpenTask}
					isArchived={true}
					extraColumns={ARCHIVE_EXTRA_COLUMNS}
					extraColumnsMeta={WORKSPACE_ARCHIVED_COLUMN_META}
				/>
			</TasksFiltersProvider>
		</UserViewProvider>
	)
}
