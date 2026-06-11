import { createFileRoute } from "@tanstack/react-router"
import PersonalTasksLayout from "../components/Personal/PersonalTasksLayout"
import { TasksView } from "../components/Tasks/TasksLayout"
import {
	type TaskRow,
	TasksFiltersProvider,
} from "../providers/TasksFiltersProvider"

export const Route = createFileRoute("/personal")({
	component: PersonalPage,
	validateSearch: (search: Record<string, unknown>): { view: TasksView } => ({
		view: search.view === TasksView.CARDS ? TasksView.CARDS : TasksView.TABLE,
	}),
	staticData: {
		header: {
			title: "הנחיות שקיבלתי",
			user: true,
		},
	},
})

const PERSONAL_DEFAULT_COLUMN_ORDER = [
	"title",
	"status",
	"responsible",
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
