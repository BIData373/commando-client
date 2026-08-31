import { createFileRoute, useNavigate } from "@tanstack/react-router"
import type { ColumnDef } from "@tanstack/react-table"
import type { TaskRowWithWorkspaceDto } from "src/api/model"
import { PersonalSectionDropdown } from "src/components/Personal/PersonalSectionDropdown"
import PersonalTaskTable from "src/components/Personal/PersonalTaskTable"
import { DropdownSection } from "src/components/shared/ArchiveDropdown"
import { ARCHIVED_AT_COLUMN } from "src/components/Tasks/ArchivedAtColumn"
import { TasksView } from "src/routes/workspace/$urlName/tasks"
import {
	ARCHIVE_DEFAULT_COLUMN_ORDER,
	ARCHIVE_DEFAULT_HIDDEN,
	COLUMN_LABELS,
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

const ARCHIVE_EXTRA_COLUMNS = [
	ARCHIVED_AT_COLUMN,
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
					onAddComment={handleAddComment}
				/>
			</TasksFiltersProvider>
		</UserViewProvider>
	)
}
