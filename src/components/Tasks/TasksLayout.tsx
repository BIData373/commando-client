import styled from "@emotion/styled"
import { Outlet, useNavigate } from "@tanstack/react-router"
import type { ColumnFiltersState } from "@tanstack/react-table"
import { useMemo } from "react"
import type { DeadlineType, WorkspaceStatusType } from "src/api/model"
import { PermissionType } from "src/api/model"
import { useGetMyPermission } from "src/api/permission/permission"
import { useListTasks } from "src/api/task/task"
import { useWorkspace } from "src/providers/WorkspaceProvider"
import { invalidateQueries } from "src/queryClient"
import {
	type TasksSearchSchemaType,
	TasksView,
} from "src/routes/workspace/$urlName/tasks"
import type { QuickFilter } from "src/utils/filter-utils"
import { toTaskRows } from "src/utils/task-table-utils"
import { useTasksFilters } from "../../providers/TasksFiltersProvider"
import { CreateTaskButton } from "../shared/CreateTaskButton"
import { FilterSeparator } from "../shared/FilterBar"
import { TasksDatePicker } from "../shared/TasksDatePicker/TasksDatePicker"
import { TooltipProvider } from "../ui/tooltip"
import { TaskCardGrid } from "./TaskCardGrid"
import { TaskFilters } from "./TaskFilters"
import { TaskTable } from "./TaskTable"

export interface TasksLayoutProps {
	view: TasksView
	urlName: string
	tabFilter: QuickFilter[]
	statusFilter: WorkspaceStatusType[]
	deadlineTypeFilter: DeadlineType[]
}

function TasksLayout({
	view,
	urlName,
	tabFilter,
	statusFilter,
	deadlineTypeFilter,
}: TasksLayoutProps) {
	const navigate = useNavigate({ from: "/workspace/$urlName/tasks" })

	const { toggleQuickFilter } = useTasksFilters()

	const {
		workspace: { id: workspaceId },
		statuses,
	} = useWorkspace()

	const {
		data: tasks = [],
		queryKey,
		isLoading,
	} = useListTasks({ workspaceId })

	const { data: myPermission } = useGetMyPermission({ workspaceId })

	const filteredTaskRows = useMemo(() => toTaskRows(tasks), [tasks])

	const allTaskRows = useMemo(() => toTaskRows(tasks), [tasks])

	const urlColumnFilters: ColumnFiltersState = [
		...(statusFilter.length ? [{ id: "status", value: statusFilter }] : []),
		...(deadlineTypeFilter.length
			? [{ id: "deadlineType", value: deadlineTypeFilter }]
			: []),
	]

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
			to: "/workspace/$urlName/tasks/$taskId",
			params: { urlName, taskId: String(taskId) },
			search: { view },
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
		toggleQuickFilter(filter)
		const next = tabFilter.includes(filter)
			? tabFilter.filter((f) => f !== filter)
			: [...tabFilter, filter]
		navigate({ search: (prev) => ({ ...prev, tabFilter: next }) })
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
		invalidateQueries([queryKey])
	}

	// function handleViewChange(newView: TasksView) {
	// 	navigateToTasks({ view: newView })
	// }

	function handleClearColumnFilters() {
		navigate({
			search: (prev) => ({
				...prev,
				statusFilter: [],
				deadlineTypeFilter: [],
			}),
		})
	}

	function handleClearQuickFilters() {
		navigate({ search: (prev) => ({ ...prev, tabFilter: [] }) })
	}

	const isManager = myPermission?.type === PermissionType.MANAGER

	return (
		<TooltipProvider>
			<TasksRoot>
				<TaskFilters
					taskRows={filteredTaskRows}
					allTasksLength={allTaskRows.length}
					onClearColumnFilters={handleClearColumnFilters}
					onClearQuickFilters={handleClearQuickFilters}
					tabFilter={tabFilter}
					onToggleTabFilter={handleToggleTabFilter}
					urlColumnFilters={urlColumnFilters}
					startSlot={<TasksDatePicker />}
					extraButtons={
						isManager && (
							<ButtonGroup>
								<FilterSeparator />
								<CreateTaskButton view={view} />
							</ButtonGroup>
						)
					}
				/>

				<ContentArea>
					{view === TasksView.TABLE ? (
						<TaskTable
							onChangeSuccess={handleChangeSuccess}
							tasks={filteredTaskRows}
							statuses={Object.values(statuses)}
							onEdit={handleEdit}
							statusFilter={statusFilter}
							deadlineTypeFilter={deadlineTypeFilter}
							onFiltersChange={handleColumnFiltersChange}
							onDoubleClick={handleOpenTask}
							isLoading={isLoading}
							isManager={isManager}
						/>
					) : (
						<TaskCardGrid tasks={tasks} />
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
