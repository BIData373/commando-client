import styled from "@emotion/styled"
import { Outlet, useNavigate } from "@tanstack/react-router"
import { isThisWeek } from "date-fns"
import { uniqBy } from "lodash"
import { useMemo, useState } from "react"
import {
	type CreateUserDto,
	PermissionType,
	type TaskWithWorkspaceDto,
	WorkspaceStatusType,
} from "src/api/model"
import {
	getListPersonalTasksQueryKey,
	useListPersonalTasks,
} from "src/api/task/task"
import { useCurrentUser } from "src/hooks/useCurrentUser"
import { useFilteredTasks } from "src/hooks/useFilteredTasks"
import { TasksView } from "src/routes/workspace/$urlName/tasks"
import { formatMesibaIcon } from "src/utils/icon-utils"
import { type TaskRow, toTaskRows } from "src/utils/task-table-utils"
import { useTasksFilters } from "../../providers/TasksFiltersProvider"
import { MultiSelectFilterDropdown } from "../shared/MultiSelectFilterDropdown"
import { TasksDatePicker } from "../shared/TasksDatePicker/TasksDatePicker"
import { TaskFilters } from "../Tasks/TaskFilters"
import { TaskTable } from "../Tasks/TaskTable"
import { TooltipProvider } from "../ui/tooltip"
import { MetricsBar } from "./MetricsBar"

function toPersonalTaskRows(
	tasks: TaskWithWorkspaceDto[],
	currentUser: CreateUserDto,
): TaskRow[] {
	return tasks.flatMap((task) =>
		toTaskRows([task])
			.map((row) => ({ ...row, workspace: task.workspace }))
			.filter(({ assignee }) =>
				assignee?.users.some(({ upn }) => upn === currentUser.upn),
			),
	)
}

function PersonalTasksLayout() {
	const navigate = useNavigate()

	const currentUser = useCurrentUser()

	const { clearQuickFilters } = useTasksFilters()

	const queryKey = getListPersonalTasksQueryKey()
	const { data: rawTasks = [], isLoading } = useListPersonalTasks()

	const [activeWorkspaceFilters, setActiveWorkspaceFilters] = useState<
		Set<number>
	>(new Set())

	const allTaskRows = useMemo(
		() => toPersonalTaskRows(rawTasks, currentUser),
		[rawTasks, currentUser],
	)

	const workspaces = uniqBy(rawTasks, "workspace.id").map(
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

	const baseFilteredTasks = useFilteredTasks(rawTasks)

	const filteredTasks =
		activeWorkspaceFilters.size > 0
			? baseFilteredTasks.filter((row) =>
					activeWorkspaceFilters.has(row.workspace.id),
				)
			: baseFilteredTasks

	const filteredTaskRows = useMemo(
		() => toPersonalTaskRows(filteredTasks, currentUser),
		[filteredTasks, currentUser],
	)

	function clearAllFilters() {
		clearQuickFilters()
		setActiveWorkspaceFilters(new Set())
	}

	const taskPermissions = useMemo(
		() =>
			Object.fromEntries(
				rawTasks.map((t) => [
					t.id,
					{
						canDelete: t.workspace.permissionType === PermissionType.MANAGER,
						canChangeStatus: !(
							t.workspace.permissionType === PermissionType.MANAGER ||
							!t.workspace.assigneeStatusEditable
						),
					},
				]),
			),
		[rawTasks],
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

	// function handleViewChange(newView: TasksView) {
	// 	navigate({ to: "/personal", search: { view: newView } })
	// }

	// useTitleBar(
	// 	() => <ViewToggle view={view} onViewChange={handleViewChange} />,
	// 	[view],
	// )

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
					taskRows={filteredTaskRows}
					allTasksLength={allTaskRows.length}
					onClearAllFilters={clearAllFilters}
					hasExtraActiveFilters={activeWorkspaceFilters.size > 0}
					extraColumnsMeta={[{ id: "workspace", label: "מפקד מנחה" }]}
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
					startSlot={<TasksDatePicker />}
				/>
				<TaskTable
					queryKey={queryKey}
					tasks={filteredTaskRows}
					isLoading={isLoading}
					onEdit={handleEdit}
					onDoubleClick={handleOpenTask}
					taskPermissions={taskPermissions}
					hideStatusAction
					showMenuColumn={false}
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
