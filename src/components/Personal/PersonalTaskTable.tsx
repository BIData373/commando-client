import styled from "@emotion/styled"
import { Outlet } from "@tanstack/react-router"
import type { ColumnDef } from "@tanstack/react-table"
import { isThisWeek } from "date-fns"
import { uniqBy } from "lodash"
import { useMemo, useState } from "react"
import { useToggleUserTaskArchive } from "src/api/archived-user-assignee-task/archived-user-assignee-task"
import {
	type TaskRowWithWorkspaceDto,
	WorkspaceStatusType,
} from "src/api/model"
import {
	getListPersonalTaskRowsQueryKey,
	useListPersonalTaskRows,
} from "src/api/task/task"
import { useFilteredTasks } from "src/hooks/useFilteredTasks"
import type { TaskArchiveEntry } from "src/hooks/useTaskColumns"
import { useTasksFilters } from "src/providers/TasksFiltersProvider"
import { invalidateQueries } from "src/queryClient"
import { formatMesibaIcon } from "src/utils/icon-utils"
import type { TaskColumnMeta } from "src/utils/task-table-utils"
import { MultiSelectFilterDropdown } from "../shared/MultiSelectFilterDropdown"
import { TasksDatePicker } from "../shared/TasksDatePicker/TasksDatePicker"
import WorkspaceCell from "../shared/WorkspaceCell"
import { ColumnHeaderWithActions } from "../Tasks/ColumnHeaderWithActions"
import { TaskFilters } from "../Tasks/TaskFilters"
import { TaskTable } from "../Tasks/TaskTable"
import { TooltipProvider } from "../ui/tooltip"
import { MetricsBar } from "./MetricsBar"

export const WORKSPACE_COLUMN: ColumnDef<TaskRowWithWorkspaceDto> = {
	id: "workspace",
	header: ({ column }) => (
		<ColumnHeaderWithActions label="מפקד מנחה" column={column} />
	),
	size: 170,
	enableColumnFilter: false,
	sortingFn: (rowA, rowB) => {
		const a = rowA.original.workspace?.title ?? ""
		const b = rowB.original.workspace?.title ?? ""
		return a.localeCompare(b, "he")
	},
	accessorFn: (row) => row.workspace?.title,
	cell: ({
		row: {
			original: { workspace },
		},
	}) => <WorkspaceCell workspace={workspace} />,
}

interface PersonalTaskTableProps {
	isArchived?: boolean
	extraColumnsMeta?: TaskColumnMeta[]
	extraColumns?: ColumnDef<TaskRowWithWorkspaceDto>[]
	onEdit?(taskId: number): void
	onOpenTask(taskId: number): void
	showMetricsBar?: boolean
	filePrefix: string
}

function PersonalTaskTable({
	isArchived = false,
	extraColumnsMeta,
	extraColumns,
	onEdit,
	onOpenTask,
	showMetricsBar = false,
	filePrefix,
}: PersonalTaskTableProps) {
	const { columnOrder, hiddenColumns } = useTasksFilters()

	const {
		data: tasks = [],
		isLoading,
		queryKey,
	} = useListPersonalTaskRows({ isArchived })

	const { mutate: toggleArchive } = useToggleUserTaskArchive({
		mutation: { onSuccess: handleChangeSuccess },
	})

	const [activeWorkspaceFilters, setActiveWorkspaceFilters] = useState<
		Set<number>
	>(new Set())

	const workspaces = uniqBy(tasks, "workspace.id").map(
		({ workspace }) => workspace,
	)

	const baseFilteredTaskRows = useFilteredTasks(tasks)

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

	function handleChangeSuccess() {
		invalidateQueries([queryKey, getListPersonalTaskRowsQueryKey()])
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
					extraColumns={[WORKSPACE_COLUMN, ...(extraColumns ?? [])]}
					extraColumnsMeta={[
						{ id: "workspace", label: "מפקד מנחה" },
						...(extraColumnsMeta ?? []),
					]}
					archiveMode={isArchived}
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
					onClick={onOpenTask}
					getPermissionType={(task) => task?.workspace?.permissionType}
					extraColumns={[WORKSPACE_COLUMN, ...(extraColumns ?? [])]}
					onArchive={onArchive}
					onUnarchive={onUnarchive}
					isPersonal={true}
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
