import styled from "@emotion/styled"
import { Outlet, useNavigate } from "@tanstack/react-router"
import type { ColumnDef, ColumnFiltersState } from "@tanstack/react-table"
import { without } from "lodash"
import { useMemo } from "react"
import { useToggleWorkspaceTaskArchive } from "src/api/archived-workspace-assignee/archived-workspace-assignee"
import type {
	DeadlineType,
	TaskRowDto,
	WorkspaceStatusType,
} from "src/api/model"
import { PermissionType } from "src/api/model"
import { useGetMyPermission } from "src/api/permission/permission"
import {
	getListPersonalTaskRowsQueryKey,
	getListTaskRowsQueryKey,
	useListTaskRows,
} from "src/api/task/task"
import { useFilteredTasks } from "src/hooks/useFilteredTasks"
import type { TaskArchiveEntry } from "src/hooks/useTaskColumns"
import { useWorkspace } from "src/providers/WorkspaceProvider"
import { invalidateQueries } from "src/queryClient"
import {
	type TasksSearchSchemaType,
	TasksView,
} from "src/routes/workspace/$urlName/tasks"
import type { QuickFilter } from "src/utils/filter-utils"
import type { TaskColumnMeta } from "src/utils/task-table-utils"
import { useTasksFilters } from "../../providers/TasksFiltersProvider"
import { CreateTaskButton } from "../shared/CreateTaskButton"
import { TasksDatePicker } from "../shared/TasksDatePicker/TasksDatePicker"
import { TooltipProvider } from "../ui/tooltip"
import { TaskCardGrid } from "./TaskCardGrid"
import { FilterSeparator, TaskFilters } from "./TaskFilters"
import { TaskTable } from "./TaskTable"

enum WorkspaceSection {
	TASKS = "tasks",
	ARCHIVE = "archive",
}

interface PersonalSectionConfig {
	taskRoute: string
	exportFilePrefix: string
}

const SECTION_CONFIG: Record<WorkspaceSection, PersonalSectionConfig> = {
	[WorkspaceSection.TASKS]: {
		taskRoute: "/workspace/$urlName/tasks/$taskId",
		exportFilePrefix: "",
	},
	[WorkspaceSection.ARCHIVE]: {
		taskRoute: "/workspace/$urlName/archive/task/$taskId",
		exportFilePrefix: "ארכיון ",
	},
}

export interface TasksLayoutProps {
	view?: TasksView
	urlName: string
	tabFilter?: QuickFilter[]
	statusFilter?: WorkspaceStatusType[]
	deadlineTypeFilter?: DeadlineType[]
	isArchived?: boolean
	extraColumns?: ColumnDef<TaskRowDto>[]
	extraColumnsMeta?: TaskColumnMeta[]
}

function TasksLayout({
	view = TasksView.TABLE,
	urlName,
	tabFilter,
	statusFilter = [],
	deadlineTypeFilter = [],
	isArchived,
	extraColumns,
	extraColumnsMeta,
}: TasksLayoutProps) {
	const navigate = useNavigate()

	const { columnOrder, hiddenColumns, toggleQuickFilter } = useTasksFilters()

	const {
		workspace: { id: workspaceId, title: workspaceTitle },
		statuses,
	} = useWorkspace()

	const {
		data: tasks = [],
		queryKey,
		isLoading,
	} = useListTaskRows({ workspaceId, isArchived })

	const { data: myPermission } = useGetMyPermission({ workspaceId })

	const { mutate: toggleArchive } = useToggleWorkspaceTaskArchive({
		mutation: { onSuccess: handleChangeSuccess },
	})

	const noWorkspaceColumnOrder = useMemo(
		() => without(columnOrder, "workspace") as (keyof TaskRowDto)[],
		[columnOrder],
	)

	const noWorkspaceHiddenColumns = useMemo(
		() => new Set([...hiddenColumns].filter((item) => item !== "workspace")),
		[hiddenColumns],
	)

	const urlColumnFilters: ColumnFiltersState = [
		...(statusFilter.length ? [{ id: "status", value: statusFilter }] : []),
		...(deadlineTypeFilter.length
			? [{ id: "deadlineType", value: deadlineTypeFilter }]
			: []),
	]

	const filteredTaskRows = useFilteredTasks(tasks)

	const section = isArchived ? WorkspaceSection.ARCHIVE : WorkspaceSection.TASKS
	const config = SECTION_CONFIG[section]

	const archiveLabel = isArchived ? "ארכיון " : ""

	function navigateToTasks(taskFilter: Partial<TasksSearchSchemaType>) {
		navigate({
			to: "/workspace/$urlName/tasks",
			params: { urlName },
			search: {
				view,
				tabFilter,
				statusFilter,
				deadlineTypeFilter,
				...taskFilter,
			},
		})
	}

	function handleOpenTask(taskId: number) {
		navigate({
			to: config.taskRoute,
			params: { urlName, taskId: String(taskId) },
			search: { view: TasksView.TABLE },
		})
	}

	function handleEdit(taskId: number) {
		navigate({
			to: "/workspace/$urlName/tasks/$taskId/edit",
			params: { urlName, taskId: String(taskId) },
			search: { view },
		})
	}

	function handleToggleTabFilter(filter: QuickFilter) {
		if (tabFilter) {
			toggleQuickFilter(filter)
			const next = tabFilter.includes(filter)
				? tabFilter.filter((f) => f !== filter)
				: [...tabFilter, filter]
			navigateToTasks({ tabFilter: next })
		}
	}

	function handleColumnFiltersChange(
		newStatusFilter: WorkspaceStatusType[],
		newDeadlineTypeFilter: DeadlineType[],
	) {
		navigateToTasks({
			statusFilter: newStatusFilter,
			deadlineTypeFilter: newDeadlineTypeFilter,
		})
	}

	function handleChangeSuccess() {
		invalidateQueries([
			queryKey,
			getListPersonalTaskRowsQueryKey(),
			getListTaskRowsQueryKey({ workspaceId }),
		])
	}

	function handleArchive(entries: TaskArchiveEntry[]) {
		entries.forEach(({ id, assigneeId }) => {
			toggleArchive({ pathParams: { id }, params: { assigneeId } })
		})
	}

	function handleUnarchive(entries: TaskArchiveEntry[]) {
		entries.forEach(({ id, assigneeId }) => {
			toggleArchive({ pathParams: { id }, params: { assigneeId } })
		})
	}

	function handleClearColumnFilters() {
		navigateToTasks({ statusFilter: [], deadlineTypeFilter: [] })
	}

	function handleClearQuickFilters() {
		navigateToTasks({ tabFilter: [] })
	}

	return (
		<TooltipProvider>
			<TasksRoot>
				<TaskFilters
					allTaskRows={tasks}
					filteredTasks={filteredTaskRows}
					columnOrder={noWorkspaceColumnOrder}
					hiddenColumns={noWorkspaceHiddenColumns}
					onClearColumnFilters={
						!isArchived ? handleClearColumnFilters : undefined
					}
					onClearQuickFilters={
						!isArchived ? handleClearQuickFilters : undefined
					}
					tabFilter={tabFilter}
					onToggleTabFilter={!isArchived ? handleToggleTabFilter : undefined}
					urlColumnFilters={urlColumnFilters}
					startSlot={<TasksDatePicker />}
					exportFilePrefix={`${archiveLabel}${workspaceTitle}`}
					extraColumns={extraColumns}
					extraColumnsMeta={extraColumnsMeta}
					extraButtons={
						!isArchived &&
						myPermission?.type === PermissionType.MANAGER && (
							<ButtonGroup>
								<FilterSeparator />

								<CreateTaskButton view={view} />
							</ButtonGroup>
						)
					}
				/>

				<ContentArea>
					{!isArchived && view === TasksView.CARDS ? (
						<TaskCardGrid taskRows={filteredTaskRows} />
					) : (
						<TaskTable
							onChangeSuccess={handleChangeSuccess}
							tasks={filteredTaskRows}
							statuses={Object.values(statuses)}
							onEdit={!isArchived ? handleEdit : undefined}
							statusFilter={statusFilter}
							deadlineTypeFilter={deadlineTypeFilter}
							onFiltersChange={
								!isArchived ? handleColumnFiltersChange : undefined
							}
							onClick={handleOpenTask}
							isLoading={isLoading}
							getPermissionType={() => myPermission?.type}
							columnOrder={noWorkspaceColumnOrder}
							hiddenColumns={noWorkspaceHiddenColumns}
							extraColumns={extraColumns}
							hideStatusAction={isArchived}
							showActionsColumn={isArchived}
							onArchive={!isArchived ? handleArchive : undefined}
							onUnarchive={isArchived ? handleUnarchive : undefined}
						/>
					)}
				</ContentArea>
			</TasksRoot>
			<Outlet />
		</TooltipProvider>
	)
}

export default TasksLayout

// ─── Layout ───────────────────────────────────────────────────────────────────

const TasksRoot = styled.div`
  padding-block: 24px;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 28px;
  overflow: hidden;
`

const ContentArea = styled.div`
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
`

// ─── Title Bar Actions ───────────────────────────────────────────────────────

const ButtonGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`
