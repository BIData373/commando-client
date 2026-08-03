import styled from "@emotion/styled"
import { Outlet, useNavigate } from "@tanstack/react-router"
import type { ColumnDef } from "@tanstack/react-table"
import { isThisWeek } from "date-fns"
import { uniqBy } from "lodash"
import { useMemo, useState } from "react"
import { useToggleUserTaskArchive } from "src/api/archived-user-assignee-task/archived-user-assignee-task"
import {
	type TaskRowWithWorkspaceDto,
	WorkspaceStatusType,
} from "src/api/model"
import { useListPersonalTaskRows } from "src/api/task/task"
import { useFilteredTasks } from "src/hooks/useFilteredTasks"
import { useTasksFilters } from "src/providers/TasksFiltersProvider"
import { invalidateQueries } from "src/queryClient"
import { TasksView } from "src/routes/workspace/$urlName/tasks"
import { formatMesibaIcon } from "src/utils/icon-utils"
import { MultiSelectFilterDropdown } from "../shared/MultiSelectFilterDropdown"
import { TasksDatePicker } from "../shared/TasksDatePicker/TasksDatePicker"
import WorkspaceCell from "../shared/WorkspaceCell"
import { ColumnHeaderWithActions } from "../Tasks/ColumnHeaderWithActions"
import { TaskFilters } from "../Tasks/TaskFilters"
import { TaskTable } from "../Tasks/TaskTable"
import { TooltipProvider } from "../ui/tooltip"
import { MetricsBar } from "./MetricsBar"
import { PersonalSectionDropdown } from "./PersonalSectionDropdown"

const EXTRA_COLUMNS: ColumnDef<TaskRowWithWorkspaceDto>[] = [
	{
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
	},
]

function PersonalTasksLayout() {
	const navigate = useNavigate()

	const { columnOrder, hiddenColumns } = useTasksFilters()

	const {
		data: allTaskRows = [],
		isLoading,
		queryKey,
	} = useListPersonalTaskRows()

	const { mutate: toggleArchive } = useToggleUserTaskArchive({
		mutation: { onSuccess: handleChangeSuccess },
	})

	const [activeWorkspaceFilters, setActiveWorkspaceFilters] = useState<
		Set<number>
	>(new Set())

	const workspaces = uniqBy(allTaskRows, "workspace.id").map(
		({ workspace }) => workspace,
	)

	const totalCount = allTaskRows.length

	const notStartedCount = allTaskRows.filter(
		(t) => t.status?.type === WorkspaceStatusType.NOT_STARTED,
	).length

	const inProgressCount = allTaskRows.filter(
		(t) => t.status?.type === WorkspaceStatusType.IN_PROGRESS,
	).length

	const weeklyNew = allTaskRows.filter((t) =>
		isThisWeek(t.createdAt, { weekStartsOn: 0 }),
	).length

	const baseFilteredTaskRows = useFilteredTasks(allTaskRows)

	const filteredTaskRows = useMemo(
		() =>
			activeWorkspaceFilters.size > 0
				? baseFilteredTaskRows.filter((row) =>
						activeWorkspaceFilters.has(row.workspace.id),
					)
				: baseFilteredTaskRows,
		[baseFilteredTaskRows, activeWorkspaceFilters],
	)

	function handleOpenTask(taskId: number) {
		navigate({
			to: "/personal/tasks/task/$taskId",
			params: { taskId: String(taskId) },
			search: { view: TasksView.TABLE },
		})
	}

	function handleEdit(taskId: number) {
		navigate({
			to: "/personal/tasks/task/$taskId/edit",
			params: { taskId: String(taskId) },
			search: { view: TasksView.TABLE },
		})
	}

	function handleChangeSuccess() {
		invalidateQueries([queryKey])
	}

	function handleArchive(ids: number[]) {
		ids.forEach((id) => {
			toggleArchive({
				pathParams: { id },
			})
		})
	}

	return (
		<TooltipProvider>
			<PersonalSectionDropdown current="tasks" />
			<PageRoot>
				<MetricsBar
					totalCount={totalCount}
					notStartedCount={notStartedCount}
					inProgressCount={inProgressCount}
					weeklyNew={weeklyNew}
				/>

				<TaskFilters
					allTaskRows={allTaskRows}
					filteredTasks={filteredTaskRows}
					columnOrder={columnOrder}
					hiddenColumns={hiddenColumns}
					extraColumns={EXTRA_COLUMNS}
					extraColumnsMeta={[{ id: "workspace", label: "מפקד מנחה" }]}
					startSlot={<TasksDatePicker />}
					exportFilePrefix="אזור אישי"
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
					onEdit={handleEdit}
					onClick={handleOpenTask}
					getPermissionType={(task) => task?.workspace?.permissionType}
					extraColumns={EXTRA_COLUMNS}
					onArchive={handleArchive}
				/>
			</PageRoot>
			<Outlet />
		</TooltipProvider>
	)
}

export default PersonalTasksLayout

const PageRoot = styled.div`
  display: flex;
  flex-direction: column;
  padding-block-end: 24px;
  gap: 28px;
  height: 100%;
  overflow: hidden;
`

const WorkspaceIcon = styled.img`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  object-fit: cover;
`
