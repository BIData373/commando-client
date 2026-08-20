import { createFileRoute } from "@tanstack/react-router"
import { useMemo } from "react"
import { DeadlineType, QuickFilter, WorkspaceStatusType } from "src/api/model"
import { DropdownSection } from "src/components/shared/ArchiveDropdown"
import { WorkspaceTabs } from "src/components/WorkspaceTabs"
import { z } from "zod"
import TasksLayout from "../../../components/Tasks/TasksLayout"
import { TasksFiltersProvider } from "../../../providers/TasksFiltersProvider"

export enum TasksView {
	CARDS = "CARDS",
	TABLE = "TABLE",
}

const queryArray = <T extends z.ZodTypeAny>(schema: T) =>
	z.preprocess(
		(v) => (Array.isArray(v) ? v : v == null ? [] : [v]),
		z.array(schema),
	)

const TasksSearchSchema = z.object({
	view: z.enum(TasksView).default(TasksView.TABLE),
	quickFilter: queryArray(z.enum(QuickFilter)).optional(),
	statusFilter: queryArray(z.enum(WorkspaceStatusType)).default([]),
	deadlineTypeFilter: queryArray(z.enum(DeadlineType)).default([]),
	assigneeFilter: queryArray(z.string()).default([]),
})

export type TasksSearchSchemaType = z.infer<typeof TasksSearchSchema>

export const Route = createFileRoute("/workspace/$urlName/tasks")({
	component: TasksPage,
	validateSearch: TasksSearchSchema,
})

function TasksPage() {
	const {
		view,
		quickFilter,
		statusFilter,
		deadlineTypeFilter,
		assigneeFilter,
	} = Route.useSearch()

	const { urlName } = Route.useParams()

	const initialQuickFilters = useMemo(
		() => (quickFilter ? new Set<QuickFilter>(quickFilter) : undefined),
		[quickFilter],
	)

	return (
		<TasksFiltersProvider initialQuickFilters={initialQuickFilters}>
			<WorkspaceTabs section={DropdownSection.TASKS} />
			<TasksLayout
				view={view}
				urlName={urlName}
				statusFilter={statusFilter}
				deadlineTypeFilter={deadlineTypeFilter}
				assigneeFilter={assigneeFilter}
			/>
		</TasksFiltersProvider>
	)
}
