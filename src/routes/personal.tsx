import { createFileRoute } from "@tanstack/react-router"
import type { TaskRow } from "src/utils/task-table-utils"
import PersonalTasksLayout from "../components/Personal/PersonalTasksLayout"
import { TasksFiltersProvider } from "../providers/TasksFiltersProvider"
import { TasksView } from "./workspace/$urlName/tasks"

export const Route = createFileRoute("/personal")({
	component: PersonalPage,
	validateSearch: (search: Record<string, unknown>): { view: TasksView } => ({
		view: search.view === TasksView.CARDS ? TasksView.CARDS : TasksView.TABLE,
	}),
	staticData: {
		header: {
			headerTitle: "אזור אישי",
			user: true,
		},
	},
})

const PERSONAL_DEFAULT_COLUMN_ORDER: (keyof TaskRow)[] = [
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

const PERSONAL_DEFAULT_HIDDEN = new Set<keyof TaskRow>([
	"tags",
	"notes",
	"updatedAt",
])

function PersonalPage() {
	// const { view } = Route.useSearch()

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
