import { createFileRoute } from "@tanstack/react-router"
import { useMemo } from "react"
import { DeadlineType, QuickFilter, WorkspaceStatusType } from "src/api/model"
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
	view: z.nativeEnum(TasksView).default(TasksView.TABLE),
	quickFilter: queryArray(z.nativeEnum(QuickFilter)).optional(),
	statusFilter: queryArray(z.nativeEnum(WorkspaceStatusType)).default([]),
	deadlineTypeFilter: queryArray(z.nativeEnum(DeadlineType)).default([]),
})

export type TasksSearchSchemaType = z.infer<typeof TasksSearchSchema>

export const Route = createFileRoute("/workspace/$urlName/tasks")({
	component: TasksPage,
	validateSearch: TasksSearchSchema,
})

function TasksPage() {
	const { view, quickFilter, statusFilter, deadlineTypeFilter } =
		Route.useSearch()

	const { urlName } = Route.useParams()

	const initialQuickFilters = useMemo(
		() => (quickFilter ? new Set<QuickFilter>(quickFilter) : undefined),
		[quickFilter],
	)

	return (
		<TasksFiltersProvider initialQuickFilters={initialQuickFilters}>
			<TasksLayout
				view={view}
				urlName={urlName}
				statusFilter={statusFilter}
				deadlineTypeFilter={deadlineTypeFilter}
			/>
		</TasksFiltersProvider>
	)
}
