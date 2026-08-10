import styled from "@emotion/styled"
import { Outlet } from "@tanstack/react-router"
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
import { TasksView } from "src/routes/workspace/$urlName/tasks"
import type { QuickFilter } from "src/utils/filter-utils"
import type { TaskColumnMeta } from "src/utils/task-table-utils"
import { useTasksFilters } from "../../providers/TasksFiltersProvider"
import { CreateTaskButton } from "../shared/CreateTaskButton"
import { TasksDatePicker } from "../shared/TasksDatePicker/TasksDatePicker"
import { TooltipProvider } from "../ui/tooltip"
import { TaskCardGrid } from "./TaskCardGrid"
import { FilterSeparator, TaskFilters } from "./TaskFilters"
import { TaskTable } from "./TaskTable"

export interface WorkspaceTaskTableProps {
	view?: TasksView
	tabFilter?: QuickFilter[]
	statusFilter?: WorkspaceStatusType[]
	deadlineTypeFilter?: DeadlineType[]
	isArchived?: boolean
	extraColumnsMeta?: TaskColumnMeta[]
	extraColumns?: ColumnDef<TaskRowDto>[]
	onEdit?(taskId: number): void
	clearQuickFilters?(): void
	clearColumnFilters?(): void
	onColumnFilterChange?(
		newStatusFilter: WorkspaceStatusType[],
		newDeadlineTypeFilter: DeadlineType[],
	): void
	toggleTabFilter?(filter: QuickFilter): void
	onOpenTask(taskId: number): void
}

function WorkspaceTaskTable({
	view = TasksView.TABLE,
	tabFilter,
	statusFilter = [],
	deadlineTypeFilter = [],
	isArchived,
	extraColumns,
	extraColumnsMeta,
	onOpenTask,
	onEdit,
	clearQuickFilters,
	clearColumnFilters,
	onColumnFilterChange,
	toggleTabFilter,
}: WorkspaceTaskTableProps) {
	const { columnOrder, hiddenColumns } = useTasksFilters()

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

	const urlColumnFilters: ColumnFiltersState = [
		...(statusFilter.length ? [{ id: "status", value: statusFilter }] : []),
		...(deadlineTypeFilter.length
			? [{ id: "deadlineType", value: deadlineTypeFilter }]
			: []),
	]

	const noWorkspaceColumnOrder = useMemo(
		() => without(columnOrder, "workspace") as (keyof TaskRowDto)[],
		[columnOrder],
	)

	const noWorkspaceHiddenColumns = useMemo(
		() => new Set([...hiddenColumns].filter((item) => item !== "workspace")),
		[hiddenColumns],
	)

	const filteredTaskRows = useFilteredTasks(tasks)

	function handleChangeSuccess() {
		invalidateQueries([
			queryKey,
			getListPersonalTaskRowsQueryKey(),
			getListTaskRowsQueryKey({ workspaceId }),
		])
	}

	function toggle(entries: TaskArchiveEntry[]) {
		entries.forEach(({ id, assigneeId }) => {
			toggleArchive({ pathParams: { id }, params: { assigneeId } })
		})
	}

	function handleArchive(entries: TaskArchiveEntry[]) {
		toggle(entries)
	}

	function handleUnarchive(entries: TaskArchiveEntry[]) {
		toggle(entries)
	}

	const onArchive = !isArchived ? handleArchive : undefined
	const onUnarchive = isArchived ? handleUnarchive : undefined

	return (
		<TooltipProvider>
			<TasksRoot>
				<TaskFilters
					allTaskRows={tasks}
					filteredTasks={filteredTaskRows}
					columnOrder={noWorkspaceColumnOrder}
					hiddenColumns={noWorkspaceHiddenColumns}
					onClearColumnFilters={clearColumnFilters}
					onClearQuickFilters={clearQuickFilters}
					tabFilter={tabFilter}
					onToggleTabFilter={toggleTabFilter}
					urlColumnFilters={urlColumnFilters ?? []}
					startSlot={<TasksDatePicker />}
					exportFilePrefix={`${isArchived ? "ארכיון " : ""}${workspaceTitle}`}
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
							onEdit={onEdit}
							statusFilter={statusFilter}
							deadlineTypeFilter={deadlineTypeFilter}
							onFiltersChange={onColumnFilterChange}
							onClick={onOpenTask}
							isLoading={isLoading}
							getPermissionType={() => myPermission?.type}
							columnOrder={noWorkspaceColumnOrder}
							hiddenColumns={noWorkspaceHiddenColumns}
							extraColumns={extraColumns}
							// hideStatusAction={isArchived}
							// showActionsColumn={isArchived}
							onArchive={onArchive}
							onUnarchive={onUnarchive}
						/>
					)}
				</ContentArea>
			</TasksRoot>
			<Outlet />
		</TooltipProvider>
	)
}

export default WorkspaceTaskTable

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
