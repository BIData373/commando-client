import { createFileRoute } from "@tanstack/react-router"
import { WorkspaceStatusDtoType } from "src/api/model"
import { QuickFilter } from "src/utils/filter-utils"
import TasksLayout, { type View } from "../../../components/Tasks/TasksLayout"
import { TasksFiltersProvider } from "../../../providers/TasksFiltersProvider"

export const Route = createFileRoute("/workspace/$urlName/tasks")({
	component: TasksPage,
	validateSearch: (
		search: Record<string, unknown>,
	): {
		view: View
		tabFilter?: QuickFilter
		statusFilter?: WorkspaceStatusDtoType
	} => ({
		view: search.view === "CARDS" ? "CARDS" : "TABLE",
		tabFilter: Object.values(QuickFilter).find((v) => v === search.tabFilter),
		statusFilter: Object.values(WorkspaceStatusDtoType).find(
			(v) => v === search.statusFilter,
		),
	}),
	staticData: {
		header: {
			title: "הנחיות",
			user: true,
			navigation: true,
			workspace: true,
		},
	},
})

function TasksPage() {
	const { view, tabFilter, statusFilter } = Route.useSearch()
	const { urlName } = Route.useParams()

	return (
		<TasksFiltersProvider>
			<TasksLayout
				view={view}
				urlName={urlName}
				tabFilter={tabFilter}
				statusFilter={statusFilter}
			/>
		</TasksFiltersProvider>
	)
}
