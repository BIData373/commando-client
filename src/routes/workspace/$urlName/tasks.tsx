import { createFileRoute, useLocation } from "@tanstack/react-router"
import { useEffect } from "react"
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
	const fromViewMore = useLocation({
		select: (location) => location.state.fromViewMore,
	})

	// History state survives a reload, so drop the flag from the browser entry
	useEffect(() => {
		if (!fromViewMore) return

		window.history.replaceState(
			{ ...window.history.state, fromViewMore: undefined },
			"",
		)
	}, [fromViewMore])

	const viewMoreFilters = fromViewMore
		? {
				quickFilter: quickFilter ?? [],
				columnFilters: [
					...(statusFilter.length
						? [{ id: "status", value: statusFilter }]
						: []),
					...(deadlineTypeFilter.length
						? [{ id: "deadlineType", value: deadlineTypeFilter }]
						: []),
				],
			}
		: undefined

	return (
		<TasksFiltersProvider initialPageFilters={viewMoreFilters}>
			<WorkspaceTabs section={DropdownSection.TASKS} />
			<TasksLayout
				view={view}
				urlName={urlName}
				statusFilter={fromViewMore ? statusFilter : []}
				deadlineTypeFilter={fromViewMore ? deadlineTypeFilter : []}
			/>
		</TasksFiltersProvider>
	)
}
