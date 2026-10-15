import { createFileRoute } from "@tanstack/react-router"
import type { TaskRowWithWorkspaceDto } from "src/api/model"
import { DropdownSection } from "src/components/shared/ArchiveDropdown"
import WorkspaceTaskTable from "src/components/Tasks/WorkspaceTaskTable"
import { WorkspaceTabs } from "src/components/WorkspaceTabs"
import { useWorkspace } from "src/providers/WorkspaceProvider"
import { WORKSPACE_ARCHIVE_EXTRA_COLUMNS } from "src/utils/task-extra-columns"
import {
	ARCHIVE_DEFAULT_HIDDEN,
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
					extraColumns={WORKSPACE_ARCHIVE_EXTRA_COLUMNS}
					extraColumnsMeta={WORKSPACE_ARCHIVED_COLUMN_META}
				/>
			</TasksFiltersProvider>
		</UserViewProvider>
	)
}
