import { createFileRoute } from "@tanstack/react-router"
import type { TaskRowWithWorkspaceDto } from "src/api/model"
import PersonalTasksLayout from "../../components/Personal/PersonalTasksLayout"
import { TasksFiltersProvider } from "../../providers/TasksFiltersProvider"
import { TasksView } from "../workspace/$urlName/tasks"

export const Route = createFileRoute("/personal/tasks")({
	component: PersonalTasksPage,
	validateSearch: (search: Record<string, unknown>): { view: TasksView } => ({
		view: search.view === TasksView.CARDS ? TasksView.CARDS : TasksView.TABLE,
	}),
})

const PERSONAL_DEFAULT_COLUMN_ORDER: (keyof TaskRowWithWorkspaceDto)[] = [
	"title",
	"status",
	"assignee",
	"deadlineType",
	"source",
	"tags",
	"notes",
	"workspace",
	"createdAt",
	"updatedAt",
]

const PERSONAL_DEFAULT_HIDDEN = new Set<keyof TaskRowWithWorkspaceDto>([
	"tags",
	"notes",
	"updatedAt",
])

function PersonalTasksPage() {
	return (
		<TasksFiltersProvider
			storageKey="personal"
			defaultColumnOrder={PERSONAL_DEFAULT_COLUMN_ORDER}
			defaultHiddenColumns={PERSONAL_DEFAULT_HIDDEN}
		>
			<PersonalTasksLayout />
		</TasksFiltersProvider>
	)
}
