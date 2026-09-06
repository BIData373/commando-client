import styled from "@emotion/styled"
import { Outlet } from "@tanstack/react-router"
import type { ColumnDef } from "@tanstack/react-table"
import { isThisWeek } from "date-fns"
import { uniqBy } from "lodash"
import { useMemo, useState } from "react"
import { useToggleUserTaskArchive } from "src/api/archived-user-assignee-task/archived-user-assignee-task"
import {
	type TaskRowWithWorkspaceDto,
	type ToggleUserTaskArchiveParams,
	WorkspaceStatusType,
} from "src/api/model"
import {
	getGetTaskQueryKey,
	getListPersonalTaskRowsQueryKey,
	useListPersonalTaskRows,
} from "src/api/task/task"
import {
	MutationFailure,
	MutationSuccess,
	reportBatch,
	runBatch,
	showFailureToast,
	UNDO_LABEL,
} from "src/functions/toasts"
import { useFilteredTasks } from "src/hooks/useFilteredTasks"
import type { TaskArchiveEntry } from "src/hooks/useTaskColumns"
import { useTasksFilters } from "src/providers/TasksFiltersProvider"
import { invalidateQueries } from "src/query-client"
import {
	ACTIVE_QUICK_FILTERS,
	ARCHIVE_QUICK_FILTERS,
} from "src/utils/filter-utils"
import { formatMesibaIcon } from "src/utils/icon-utils"
import {
	COLUMN_LABELS,
	TASK_COLUMN_ID,
	type TaskColumnMeta,
	WORKSPACE_COLUMN_META,
} from "src/utils/task-table-utils"
import { MultiSelectFilterDropdown } from "../shared/MultiSelectFilterDropdown"
import { TasksDatePicker } from "../shared/TasksDatePicker/TasksDatePicker"
import WorkspaceCell from "../shared/WorkspaceCell"
import { ColumnHeaderWithActions } from "../Tasks/ColumnHeaderWithActions"
import { TaskFilters } from "../Tasks/TaskFilters"
import { TaskTable } from "../Tasks/TaskTable"
import { TooltipProvider } from "../ui/tooltip"
import { MetricsBar } from "./MetricsBar"

const WORKSPACE_COLUMN_DEFINITION: ColumnDef<TaskRowWithWorkspaceDto> = {
	id: TASK_COLUMN_ID.workspace,
	header: ({ column }) => (
		<ColumnHeaderWithActions label={COLUMN_LABELS.workspace} column={column} />
	),
	size: 170,
	enableColumnFilter: false,
	sortingFn: (rowA, rowB) => {
		const a = rowA.original.workspace?.title ?? ""
		const b = rowB.original.workspace?.title ?? ""
		return a.localeCompare(b, "he")
	},
	accessorFn: (row) => row.workspace?.title,
}

interface PersonalTaskTableProps {
	isArchived?: boolean
	extraColumnsMeta?: TaskColumnMeta[]
	extraColumns?: ColumnDef<TaskRowWithWorkspaceDto>[]
	onEdit?(taskId: number): void
	onAddComment?(taskId: number): void
	onOpenTask(taskId: number): void
	showMetricsBar?: boolean
	filePrefix: string
}

function PersonalTaskTable({
	isArchived = false,
	extraColumnsMeta,
	extraColumns,
	onEdit,
	onAddComment,
	onOpenTask,
	showMetricsBar = false,
	filePrefix,
}: PersonalTaskTableProps) {
	const { columnOrder, hiddenColumns, searchQuery } = useTasksFilters()

	const {
		data: tasks = [],
		isLoading,
		queryKey,
	} = useListPersonalTaskRows({ isArchived })

	function handleChangeSuccess() {
		invalidateQueries([queryKey, getListPersonalTaskRowsQueryKey()])
	}

	function handleToggleSuccess(
		_: void,
		{ params: { taskId } }: { params: ToggleUserTaskArchiveParams },
	) {
		handleChangeSuccess()
		invalidateQueries([getGetTaskQueryKey({ id: taskId })])
	}

	// Archiving runs one mutation per task, so the per-task toasts are
	// suppressed and the batch reports its own aggregated result.
	const { mutateAsync: toggleArchive } = useToggleUserTaskArchive({
		mutation: {
			onSuccess: handleToggleSuccess,
			meta: { toast: { success: false, error: false } },
		},
	})

	const [activeWorkspaceFilters, setActiveWorkspaceFilters] = useState<
		Set<number>
	>(new Set())

	const workspaces = uniqBy(tasks, "workspace.id").map(
		({ workspace }) => workspace,
	)

	const baseFilteredTaskRows = useFilteredTasks(tasks, {
		additionalSearchValues: (task) => [task.workspace?.title],
	})

	const workspaceColumn = useMemo<ColumnDef<TaskRowWithWorkspaceDto>>(
		() => ({
			...WORKSPACE_COLUMN_DEFINITION,
			cell: ({
				row: {
					original: { workspace },
				},
			}) => <WorkspaceCell workspace={workspace} searchQuery={searchQuery} />,
		}),
		[searchQuery],
	)

	const filteredTaskRows = useMemo(
		() =>
			activeWorkspaceFilters.size > 0
				? baseFilteredTaskRows.filter((row) =>
						activeWorkspaceFilters.has(row.workspace.id),
					)
				: baseFilteredTaskRows,
		[baseFilteredTaskRows, activeWorkspaceFilters],
	)

	const totalCount = tasks.length

	const notStartedCount = tasks.filter(
		(t) => t.status?.type === WorkspaceStatusType.NOT_STARTED,
	).length

	const inProgressCount = tasks.filter(
		(t) => t.status?.type === WorkspaceStatusType.IN_PROGRESS,
	).length

	const weeklyNew = tasks.filter((t) =>
		isThisWeek(t.createdAt, { weekStartsOn: 0 }),
	).length

	async function toggleArchiveEntries(entries: TaskArchiveEntry[]) {
		return runBatch(entries, async ({ id, assigneeId }) => {
			if (!assigneeId) return
			await toggleArchive({ params: { taskId: id, assigneeId } })
		})
	}

	async function handleCancelArchive(entries: TaskArchiveEntry[]) {
		const restored = await toggleArchiveEntries(entries)

		if (restored.failed > 0) {
			showFailureToast(MutationFailure.UndoArchiveFailed)
		}
	}

	async function handleArchive(entries: TaskArchiveEntry[]) {
		const archived = await toggleArchiveEntries(entries)

		reportBatch(archived, {
			singular: MutationSuccess.ArchiveGuideline,
			plural: MutationSuccess.ArchiveGuidelines,
			failure: MutationFailure.ArchiveFailed,
			options: {
				actions: {
					variant: "cancel",
					label: UNDO_LABEL,
					onClick: () => {
						handleCancelArchive(entries)
					},
				},
			},
		})
	}

	async function handleUnarchive(entries: TaskArchiveEntry[]) {
		const restored = await toggleArchiveEntries(entries)

		reportBatch(restored, {
			singular: MutationSuccess.UnarchiveGuideline,
			plural: MutationSuccess.UnarchiveGuidelines,
			failure: MutationFailure.UndoArchiveFailed,
		})
	}

	const onArchive = !isArchived ? handleArchive : undefined
	const onUnarchive = isArchived ? handleUnarchive : undefined

	return (
		<TooltipProvider>
			<PageRoot>
				{isArchived && <ArchiveHeader>ארכיון</ArchiveHeader>}

				{showMetricsBar && (
					<MetricsBar
						totalCount={totalCount}
						notStartedCount={notStartedCount}
						inProgressCount={inProgressCount}
						weeklyNew={weeklyNew}
					/>
				)}

				<TaskFilters
					allTaskRows={tasks}
					filteredTasks={filteredTaskRows}
					columnOrder={columnOrder}
					hiddenColumns={hiddenColumns}
					extraColumns={[workspaceColumn, ...(extraColumns ?? [])]}
					extraColumnsMeta={[
						WORKSPACE_COLUMN_META,
						...(extraColumnsMeta ?? []),
					]}
					quickFilters={
						isArchived ? ARCHIVE_QUICK_FILTERS : ACTIVE_QUICK_FILTERS
					}
					startSlot={<TasksDatePicker />}
					exportFilePrefix={filePrefix}
					extraFilters={
						<MultiSelectFilterDropdown
							label={
								activeWorkspaceFilters.size > 0
									? `סביבות (${activeWorkspaceFilters.size})`
									: "כל הסביבות"
							}
							options={workspaces.map((ws) => ({
								value: ws.id,
								label: ws.title,
								icon: (
									<WorkspaceIcon
										src={formatMesibaIcon(ws.icon)}
										alt={ws.title}
									/>
								),
							}))}
							activeValues={activeWorkspaceFilters}
							onApply={setActiveWorkspaceFilters}
							$active={activeWorkspaceFilters.size > 0}
							emptyTitle="טרם הוגדרו סביבות"
							emptyDescription="לאחר שסביבות יוצרו, הן יופיעו כאן"
						/>
					}
				/>
				<TaskTable<TaskRowWithWorkspaceDto>
					tasks={filteredTaskRows}
					isLoading={isLoading}
					hideStatusAction
					showActionsColumn={true}
					columnOrder={columnOrder}
					hiddenColumns={hiddenColumns}
					onChangeSuccess={handleChangeSuccess}
					onEdit={onEdit}
					onAddComment={onAddComment}
					onClick={onOpenTask}
					getPermissionType={(task) => task?.workspace?.permissionType}
					extraColumns={[workspaceColumn, ...(extraColumns ?? [])]}
					onArchive={onArchive}
					onUnarchive={onUnarchive}
				/>
			</PageRoot>
			<Outlet />
		</TooltipProvider>
	)
}

export default PersonalTaskTable

const PageRoot = styled.div`
  display: flex;
  flex-direction: column;
  gap: 28px;
  padding-block-end: 24px;
  height: 100%;
  overflow: hidden;
`

const WorkspaceIcon = styled.img`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  object-fit: cover;
`

const ArchiveHeader = styled.span`
	color: var(--text-color-2);
	font-size: var(--fs-heading-1);
	font-weight: 500;
`
