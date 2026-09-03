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
	getGetTaskQueryKey,
	getListPersonalTaskRowsQueryKey,
	getListTaskRowsQueryKey,
	useListTaskRows,
} from "src/api/task/task"
import { useFilteredTasks } from "src/hooks/useFilteredTasks"
import type { TaskArchiveEntry } from "src/hooks/useTaskColumns"
import { useWorkspace } from "src/providers/WorkspaceProvider"
import { invalidateQueries } from "src/queryClient"
import { TasksView } from "src/routes/workspace/$urlName/tasks"
import {
	ACTIVE_QUICK_FILTERS,
	ARCHIVE_QUICK_FILTERS,
} from "src/utils/filter-utils"
import { TASK_COLUMN_ID, type TaskColumnMeta } from "src/utils/task-table-utils"
import { useTasksFilters } from "../../providers/TasksFiltersProvider"
import { CreateTaskButton } from "../shared/CreateTaskButton"
import { TasksDatePicker } from "../shared/TasksDatePicker/TasksDatePicker"
import { TooltipProvider } from "../ui/tooltip"
import { TaskCardGrid } from "./TaskCardGrid"
import { FilterSeparator, TaskFilters } from "./TaskFilters"
import { TaskTable } from "./TaskTable"

export interface WorkspaceTaskTableProps {
	view?: TasksView
	statusFilter?: WorkspaceStatusType[]
	deadlineTypeFilter?: DeadlineType[]
	isArchived?: boolean
	extraColumnsMeta?: TaskColumnMeta[]
	extraColumns?: ColumnDef<TaskRowDto>[]
	onEdit?(taskId: number): void
	clearColumnFilters?(): void
	onColumnFilterChange?(
		newStatusFilter: WorkspaceStatusType[],
		newDeadlineTypeFilter: DeadlineType[],
	): void
	onOpenTask(taskId: number): void
}

function WorkspaceTaskTable({
	view = TasksView.TABLE,
	statusFilter = [],
	deadlineTypeFilter = [],
	isArchived = false,
	extraColumns,
	extraColumnsMeta,
	onOpenTask,
	onEdit,
	clearColumnFilters,
	onColumnFilterChange,
}: WorkspaceTaskTableProps) {
	const { columnOrder, hiddenColumns, assigneeFilter } = useTasksFilters()

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
		...(assigneeFilter.length
			? [{ id: "assignee", value: assigneeFilter }]
			: []),
	]

	const noWorkspaceColumnOrder = useMemo(
		() =>
			without(columnOrder, TASK_COLUMN_ID.workspace) as (keyof TaskRowDto)[],
		[columnOrder],
	)

	const noWorkspaceHiddenColumns = useMemo(
		() =>
			new Set(
				[...hiddenColumns].filter((item) => item !== TASK_COLUMN_ID.workspace),
			),
		[hiddenColumns],
	)

	const isManager = myPermission?.type === PermissionType.MANAGER

	const filteredTaskRows = useFilteredTasks(tasks)

	function handleChangeSuccess() {
		invalidateQueries([
			queryKey,
			getListPersonalTaskRowsQueryKey(),
			getListTaskRowsQueryKey({ workspaceId }),
		])
	}

	function handleToggleArchive(entries: TaskArchiveEntry[]) {
		entries.forEach(({ id, assigneeId }) => {
			toggleArchive(
				{ params: { taskId: id, assigneeId } },
				{
					onSuccess: () => {
						invalidateQueries([getGetTaskQueryKey({ id })])
					},
				},
			)
		})
	}

	function handleArchive(entries: TaskArchiveEntry[]) {
		handleToggleArchive(entries)
	}

	function handleUnarchive(entries: TaskArchiveEntry[]) {
		handleToggleArchive(entries)
	}

	const onArchive = isManager && !isArchived ? handleArchive : undefined
	const onUnarchive = isManager && isArchived ? handleUnarchive : undefined

	return (
		<TooltipProvider>
			<TasksRoot>
				{isArchived && <ArchiveHeader>ארכיון</ArchiveHeader>}

				<TaskFilters
					allTaskRows={tasks}
					filteredTasks={filteredTaskRows}
					columnOrder={noWorkspaceColumnOrder}
					hiddenColumns={noWorkspaceHiddenColumns}
					onClearColumnFilters={clearColumnFilters}
					quickFilters={
						isArchived ? ARCHIVE_QUICK_FILTERS : ACTIVE_QUICK_FILTERS
					}
					urlColumnFilters={urlColumnFilters ?? []}
					startSlot={<TasksDatePicker />}
					baseMessagesParams={{
						workspaceId,
						isArchived: isArchived || undefined,
					}}
					exportFilePrefix={`${isArchived ? "ארכיון " : ""}${workspaceTitle}`}
					extraColumns={extraColumns}
					extraColumnsMeta={extraColumnsMeta}
					extraButtons={
						!isArchived &&
						isManager && (
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
							allowDelete={isManager}
							onArchive={onArchive}
							onUnarchive={onUnarchive}
							// hideStatusAction={isArchived}
							// showActionsColumn={isArchived}
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

const ArchiveHeader = styled.span`
	color: var(--text-color-2);
	font-size: var(--fs-heading-1);
	font-weight: 500;
`
