import { createFileRoute } from "@tanstack/react-router"
import type { TaskRowWithWorkspaceDto } from "src/api/model"
import WorkspaceTasksArchiveLayout from "../../../components/Tasks/WorkspaceTasksArchiveLayout"
import { TasksFiltersProvider } from "../../../providers/TasksFiltersProvider"

export const Route = createFileRoute("/workspace/$urlName/archive")({
	component: WorkspaceArchivePage,
	staticData: {
		header: {
			user: true,
		},
	},
})

const ARCHIVE_DEFAULT_COLUMN_ORDER: (keyof TaskRowWithWorkspaceDto)[] = [
	"title",
	"status",
	"assignee",
	"deadlineType",
	"source",
	"workspace",
	"archivedAt",
	"createdAt",
	"tags",
	"notes",
	"updatedAt",
]

const ARCHIVE_DEFAULT_HIDDEN = new Set<keyof TaskRowWithWorkspaceDto>([
	"tags",
	"notes",
	"updatedAt",
])

function WorkspaceArchivePage() {
	const { urlName } = Route.useParams()

	return (
		<TasksFiltersProvider
			storageKey="workspace-archive"
			defaultColumnOrder={ARCHIVE_DEFAULT_COLUMN_ORDER}
			defaultHiddenColumns={ARCHIVE_DEFAULT_HIDDEN}
		>
			<WorkspaceTasksArchiveLayout urlName={urlName} />
		</TasksFiltersProvider>
	)
}
