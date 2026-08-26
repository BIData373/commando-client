import { createFileRoute } from "@tanstack/react-router"
import type { ColumnDef } from "@tanstack/react-table"
import type { TaskRowDto } from "src/api/model"
import { DropdownSection } from "src/components/shared/ArchiveDropdown"
import { ARCHIVED_AT_COLUMN } from "src/components/Tasks/ArchivedAtColumn"
import WorkspaceTaskTable from "src/components/Tasks/WorkspaceTaskTable"
import { WorkspaceTabs } from "src/components/WorkspaceTabs"
import { useWorkspace } from "src/providers/WorkspaceProvider"
import {
	ARCHIVE_DEFAULT_COLUMN_ORDER,
	ARCHIVE_DEFAULT_HIDDEN,
	COLUMN_LABELS,
	TASK_COLUMN_ID,
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

const ARCHIVE_EXTRA_COLUMNS = [ARCHIVED_AT_COLUMN] as ColumnDef<TaskRowDto>[]

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
			defaultColumnOrder={ARCHIVE_DEFAULT_COLUMN_ORDER}
			defaultHiddenColumns={ARCHIVE_DEFAULT_HIDDEN}
		>
			<TasksFiltersProvider>
				<WorkspaceTabs section={DropdownSection.ARCHIVE} />
				<WorkspaceTaskTable
					onOpenTask={handleOpenTask}
					isArchived={true}
					extraColumns={ARCHIVE_EXTRA_COLUMNS}
					extraColumnsMeta={[
						{ id: TASK_COLUMN_ID.archivedAt, label: COLUMN_LABELS.archivedAt },
					]}
				/>
			</TasksFiltersProvider>
		</UserViewProvider>
	)
}
