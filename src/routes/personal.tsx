import { createFileRoute } from "@tanstack/react-router"
import Header from "src/components/Header"
import { useRenderInHeader } from "src/providers/HeaderProvider"
import { UserViewProvider } from "src/providers/UserViewProvider"
import PersonalTasksLayout from "../components/Personal/PersonalTasksLayout"
import { TasksFiltersProvider } from "../providers/TasksFiltersProvider"
import { TasksView } from "./workspace/$urlName/tasks"

export const Route = createFileRoute("/personal")({
	component: PersonalPage,
	validateSearch: (search: Record<string, unknown>): { view: TasksView } => ({
		view: search.view === TasksView.CARDS ? TasksView.CARDS : TasksView.TABLE,
	}),
})

function PersonalPage() {
	useRenderInHeader("center", "אזור אישי")

	return (
		<UserViewProvider>
			<TasksFiltersProvider>
				<Header />
				<PersonalTasksLayout />
			</TasksFiltersProvider>
		</UserViewProvider>
	)
}
