import { createFileRoute } from "@tanstack/react-router"
import type { TaskRowWithWorkspaceDto } from "src/api/model"
import PersonalArchiveLayout from "../../components/Personal/PersonalArchiveLayout"
import { TasksFiltersProvider } from "../../providers/TasksFiltersProvider"

export const Route = createFileRoute("/personal/archive")({
	component: PersonalArchivePage,
	staticData: {
		header: {
			headerTitle: "ארכיון אישי",
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

function PersonalArchivePage() {
	return (
		<TasksFiltersProvider
			storageKey="personal-archive"
			defaultColumnOrder={ARCHIVE_DEFAULT_COLUMN_ORDER}
			defaultHiddenColumns={ARCHIVE_DEFAULT_HIDDEN}
		>
			<PersonalArchiveLayout />
		</TasksFiltersProvider>
	)
}
