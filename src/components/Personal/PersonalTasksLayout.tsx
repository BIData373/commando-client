import styled from "@emotion/styled"
import { Outlet, useNavigate } from "@tanstack/react-router"
import type { ColumnDef } from "@tanstack/react-table"
import { isThisWeek } from "date-fns"
import { uniqBy } from "lodash"
import { useMemo, useState } from "react"
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

function getExtraColumns(
	searchQuery: string,
): ColumnDef<TaskRowWithWorkspaceDto>[] {
	return [
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
			}) => <WorkspaceCell workspace={workspace} searchQuery={searchQuery} />,
		},
	]
}

function getPersonalTaskSearchValues(
	task: TaskRowWithWorkspaceDto,
): Array<string | number | null | undefined> {
	return [task.workspace?.title]
}

function PersonalTasksLayout() {
	const navigate = useNavigate()

	const { columnOrder, hiddenColumns, searchQuery } = useTasksFilters()

	const extraColumns = getExtraColumns(searchQuery)

	const {
		data: allTaskRows = [],
		isLoading,
		queryKey,
	} = useListPersonalTaskRows()

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

	const baseFilteredTaskRows = useFilteredTasks(allTaskRows, {
		additionalSearchValues: getPersonalTaskSearchValues,
	})
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
			to: "/personal/task/$taskId",
			params: { taskId: String(taskId) },
			search: { view: TasksView.TABLE },
		})
	}

	function handleEdit(taskId: number) {
		navigate({
			to: "/personal/task/$taskId/edit",
			params: { taskId: String(taskId) },
			search: { view: TasksView.TABLE },
		})
	}

	function handleChangeSuccess() {
		invalidateQueries([queryKey])
	}

	// function handleViewChange(newView: TasksView) {
	// 	navigate({ to: "/personal", search: { view: newView } })
	// }

	return (
		<TooltipProvider>
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
					extraColumns={extraColumns}
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
					showActionsColumn={false}
					columnOrder={columnOrder}
					hiddenColumns={hiddenColumns}
					onChangeSuccess={handleChangeSuccess}
					onEdit={handleEdit}
					onClick={handleOpenTask}
					getPermissionType={(task) => task?.workspace?.permissionType}
					extraColumns={extraColumns}
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
