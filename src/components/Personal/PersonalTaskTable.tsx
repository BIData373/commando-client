import styled from "@emotion/styled"
import { Outlet } from "@tanstack/react-router"
import type { ColumnDef } from "@tanstack/react-table"
import { isThisWeek } from "date-fns"
import { uniqBy } from "lodash"
import { useMemo, useState } from "react"
import {
	type TaskRowWithWorkspaceDto,
	WorkspaceStatusType,
} from "src/api/model"
import {
	getListPersonalTaskRowsQueryKey,
	useListPersonalTaskRows,
} from "src/api/task/task"
import type { AppTableFeatures } from "src/consts/table-features"
import { useFilteredTasks } from "src/hooks/useFilteredTasks"
import { useTaskArchive } from "src/hooks/useTaskArchive"
import { useTasksFilters } from "src/providers/TasksFiltersProvider"
import { invalidateQueries } from "src/query-client"
import {
	ACTIVE_QUICK_FILTERS,
	ARCHIVE_QUICK_FILTERS,
} from "src/utils/filter-utils"
import { formatMesibaIcon } from "src/utils/icon-utils"
import {
	type TaskColumnMeta,
	WORKSPACE_COLUMN_META,
} from "src/utils/task-table-utils"
import { MultiSelectFilterDropdown } from "../shared/MultiSelectFilterDropdown"
import { TasksDatePicker } from "../shared/TasksDatePicker/TasksDatePicker"
import { TaskFilters } from "../Tasks/TaskFilters"
import { TaskTable } from "../Tasks/TaskTable"
import { TooltipProvider } from "../ui/tooltip"
import { MetricsBar } from "./MetricsBar"
import { PERSONAL_EXTRA_COLUMNS } from "src/utils/task-extra-columns"

function getWorkspaceSearchValues(task: TaskRowWithWorkspaceDto) {
	return [task.workspace?.title]
}

interface PersonalTaskMetrics {
	totalCount: number
	notStartedCount: number
	inProgressCount: number
	weeklyNew: number
}

function countByStatus(
	tasks: TaskRowWithWorkspaceDto[],
	statusType: WorkspaceStatusType,
): number {
	return tasks.filter((task) => task.status?.type === statusType).length
}

function getPersonalTaskMetrics(
	tasks: TaskRowWithWorkspaceDto[],
): PersonalTaskMetrics {
	return {
		totalCount: tasks.length,
		notStartedCount: countByStatus(tasks, WorkspaceStatusType.NOT_STARTED),
		inProgressCount: countByStatus(tasks, WorkspaceStatusType.IN_PROGRESS),
		weeklyNew: tasks.filter((task) =>
			isThisWeek(task.createdAt, { weekStartsOn: 0 }),
		).length,
	}
}

interface PersonalTaskTableProps {
	isArchived?: boolean
	extraColumnsMeta?: TaskColumnMeta[]
	extraColumns?: ColumnDef<AppTableFeatures, TaskRowWithWorkspaceDto>[]
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
	filePrefix,
}: PersonalTaskTableProps) {
	const { columnOrder, hiddenColumns } = useTasksFilters()

	const {
		data: tasks = [],
		isLoading,
		queryKey,
	} = useListPersonalTaskRows({ isArchived })

	function handleChangeSuccess() {
		invalidateQueries([queryKey, getListPersonalTaskRowsQueryKey()])
	}

	const { archive, unarchive } = useTaskArchive({ listQueryKey: queryKey })

	const [activeWorkspaceFilters, setActiveWorkspaceFilters] = useState<
		Set<number>
	>(new Set())

	const workspaces = useMemo(
		() => uniqBy(tasks, "workspace.id").map(({ workspace }) => workspace),
		[tasks],
	)

	const baseFilteredTaskRows = useFilteredTasks(tasks, {
		additionalSearchValues: getWorkspaceSearchValues,
	})

	const tableExtraColumns = useMemo(
		() => [...PERSONAL_EXTRA_COLUMNS, ...(extraColumns ?? [])],
		[extraColumns],
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

	const onArchive = !isArchived ? archive : undefined
	const onUnarchive = isArchived ? unarchive : undefined

	return (
		<TooltipProvider>
			<PageRoot>
				{isArchived && <ArchiveHeader>ארכיון</ArchiveHeader>}

				<MetricsBar {...getPersonalTaskMetrics(tasks)} />

				<TaskFilters
					allTaskRows={tasks}
					filteredTasks={filteredTaskRows}
					columnOrder={columnOrder}
					hiddenColumns={hiddenColumns}
					extraColumns={tableExtraColumns}
					extraColumnsMeta={[
						...WORKSPACE_COLUMN_META,
						...(extraColumnsMeta ?? []),
					]}
					quickFilters={
						isArchived ? ARCHIVE_QUICK_FILTERS : ACTIVE_QUICK_FILTERS
					}
					startSlot={<TasksDatePicker />}
					baseMessagesParams={{
						personal: true,
						isArchived: isArchived || undefined,
					}}
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
					extraColumns={tableExtraColumns}
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
  padding-block-start: 24px;
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
