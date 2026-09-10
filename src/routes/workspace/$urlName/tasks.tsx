import { createFileRoute, useLocation } from "@tanstack/react-router"
import { useEffect, useMemo } from "react"
import { DeadlineType, QuickFilter, WorkspaceStatusType } from "src/api/model"
import { upsertUserWorkspaceVisit } from "src/api/user-workspace-entries/user-workspace-entries"
import { DropdownSection } from "src/components/shared/ArchiveDropdown"
import { WorkspaceTabs } from "src/components/WorkspaceTabs"
import { setTaskViewed } from "src/functions/setTaskViewed"
import { useUserWorkspaceEntrie } from "src/hooks/useUserWorkspaceExit"
import { useWorkspace } from "src/providers/WorkspaceProvider"
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
	const location = useLocation()
	const { view, quickFilter, statusFilter, deadlineTypeFilter } =
		Route.useSearch()

	const { urlName } = Route.useParams()
	const {
		workspace: { id: workspaceId },
	} = useWorkspace()

	useUserWorkspaceEntrie({ workspaceId })

	useEffect(() => {
		if (!location.pathname.includes(urlName)) {
			upsertUserWorkspaceVisit({ workspaceId })
			setTaskViewed(undefined, workspaceId)
		}
	}, [location.pathname, urlName, workspaceId])

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
			/>
		</TasksFiltersProvider>
	)
}
