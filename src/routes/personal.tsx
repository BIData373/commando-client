import { createFileRoute } from "@tanstack/react-router"
import type { TaskRowWithWorkspaceDto } from "src/api/model"
import Header from "src/components/Header"
import { ContentScrollArea } from "src/components/shared/ContentScrollArea"
import { PageShell } from "src/components/shared/PageShell"
import { useRenderInHeader } from "src/providers/HeaderProvider"
import PersonalTasksLayout from "../components/Personal/PersonalTasksLayout"
import { TasksFiltersProvider } from "../providers/TasksFiltersProvider"
import { TasksView } from "./workspace/$urlName/tasks"

export const Route = createFileRoute("/personal")({
	component: PersonalPage,
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

function PersonalPage() {
	useRenderInHeader("center", "אזור אישי")

	return (
		<TasksFiltersProvider
			storageKey="personal"
			defaultColumnOrder={PERSONAL_DEFAULT_COLUMN_ORDER}
			defaultHiddenColumns={PERSONAL_DEFAULT_HIDDEN}
		>
			<PageShell>
				<Header />
				<ContentScrollArea>
					<PersonalTasksLayout />
				</ContentScrollArea>
			</PageShell>
		</TasksFiltersProvider>
	)
}
