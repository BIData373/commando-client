import { createFileRoute, useNavigate } from "@tanstack/react-router"
import type { TaskRowWithWorkspaceDto } from "src/api/model"
import { PersonalSectionDropdown } from "src/components/Personal/PersonalSectionDropdown"
import PersonalTaskTable from "src/components/Personal/PersonalTaskTable"
import { DropdownSection } from "src/components/shared/ArchiveDropdown"
import { TasksFiltersProvider } from "../../providers/TasksFiltersProvider"
import { UserViewProvider } from "../../providers/UserViewProvider"
import { TasksView } from "../workspace/$urlName/tasks"

export const Route = createFileRoute("/personal/tasks")({
	component: PersonalTasksPage,
	validateSearch: (
		search: Record<string, unknown>,
	): { view: TasksView; focusComment?: boolean } => ({
		view: search.view === TasksView.CARDS ? TasksView.CARDS : TasksView.TABLE,
		focusComment: search.focusComment
			? Boolean(search.focusComment)
			: undefined,
	}),
})

const PERSONAL_DEFAULT_COLUMN_ORDER: (keyof TaskRowWithWorkspaceDto)[] = [
	"title",
	"status",
	"assignee",
	"deadlineType",
	"source",
	"tags",
	"workspace",
	"createdAt",
	"updatedAt",
]

const PERSONAL_DEFAULT_HIDDEN = new Set<keyof TaskRowWithWorkspaceDto>([
	"tags",
	"updatedAt",
])

function PersonalTasksPage() {
	const navigate = useNavigate()

	function handleOpenTask(taskId: number) {
		navigate({
			to: "/personal/tasks/task/$taskId",
			params: { taskId: String(taskId) },
			search: { view: TasksView.TABLE },
		})
	}

	function handleEdit(taskId: number) {
		navigate({
			to: "/personal/tasks/task/$taskId/edit",
			params: { taskId: String(taskId) },
			search: { view: TasksView.TABLE },
		})
	}

	function handleAddComment(taskId: number) {
		navigate({
			to: "/personal/tasks/task/$taskId",
			params: { taskId: String(taskId) },
			search: { view: TasksView.TABLE, focusComment: true },
		})
	}

	return (
		<UserViewProvider
			defaultColumnOrder={PERSONAL_DEFAULT_COLUMN_ORDER}
			defaultHiddenColumns={PERSONAL_DEFAULT_HIDDEN}
		>
			<TasksFiltersProvider>
				<PersonalSectionDropdown current={DropdownSection.TASKS} />
				<PersonalTaskTable
					filePrefix="אזור אישי"
					onOpenTask={handleOpenTask}
					onEdit={handleEdit}
					onAddComment={handleAddComment}
				/>
			</TasksFiltersProvider>
		</UserViewProvider>
	)
}
