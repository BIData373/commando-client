import styled from "@emotion/styled"
import { Outlet, useNavigate } from "@tanstack/react-router"
import type { ColumnFiltersState } from "@tanstack/react-table"
import { concat, uniq } from "lodash"
import { useMemo, useState } from "react"
import type { DeadlineType, WorkspaceStatusType } from "src/api/model"
import { PermissionType } from "src/api/model"
import { useGetMyPermission } from "src/api/permission/permission"
import { useListTasks } from "src/api/task/task"
import { useFilteredTasks } from "src/hooks/useFilteredTasks"
import { useRenderInHeader } from "src/providers/HeaderProvider"
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
import { MultiSelectFilterDropdown } from "../shared/MultiSelectFilterDropdown"
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

	const { dateRange, setDateRange, toggleQuickFilter, clearQuickFilters } =
		useTasksFilters()

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

	const [activeTopicFilters, setActiveTopicFilters] = useState<Set<string>>(
		new Set(),
	)

	const allTopics = uniq(
		tasks.flatMap((t) =>
			concat(t.tags, t.source?.tags ?? []).map((tag) => tag.name),
		),
	)

	const filteredTasks = useFilteredTasks(
		tasks,
		activeTopicFilters.size > 0
			? (task) =>
					concat(task.tags, task.source?.tags ?? []).some((tag) =>
						activeTopicFilters.has(tag.name),
					)
			: undefined,
	)

	const filteredTaskRows = useMemo(
		() => toTaskRows(filteredTasks),
		[filteredTasks],
	)

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

	function clearAllFilters() {
		setActiveTopicFilters(new Set())
		setDateRange(undefined)
		clearQuickFilters()
		navigate({
			search: (prev) => ({
				...prev,
				tabFilter: [],
				statusFilter: [],
				deadlineTypeFilter: [],
			}),
		})
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

	const isManager = myPermission?.type === PermissionType.MANAGER

	useRenderInHeader(
		"titleBar",
		<ButtonGroup>
			{isManager && <CreateTaskButton view={view} />}
			{/* <SectionDivider />
				<ViewToggle view={view} onViewChange={handleViewChange} /> */}
		</ButtonGroup>,
		[urlName, view, isManager],
	)

	return (
		<TooltipProvider>
			<TasksRoot>
				<TaskFilters
					taskRows={filteredTaskRows}
					allTasksLength={allTaskRows.length}
					onClearAllFilters={clearAllFilters}
					tabFilter={tabFilter}
					onToggleTabFilter={handleToggleTabFilter}
					hasExtraActiveFilters={activeTopicFilters.size > 0 || !!dateRange}
					urlColumnFilters={urlColumnFilters}
					extraFilters={
						<MultiSelectFilterDropdown
							label="נושא"
							options={allTopics.map((t) => ({ value: t, label: t }))}
							activeValues={activeTopicFilters}
							onApply={setActiveTopicFilters}
							$active={activeTopicFilters.size > 0}
							emptyTitle="טרם הוגדר נושאים"
							emptyDescription={
								"ביצירת הנחיות ניתן לחלק אותם\nלנושאים, קטגוריות או מאמצים"
							}
						/>
					}
					startSlot={<TasksDatePicker />}
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
							onClick={handleOpenTask}
							isLoading={isLoading}
							isManager={isManager}
						/>
					) : (
						<TaskCardGrid tasks={filteredTasks} />
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
  direction: ltr;
  display: flex;
  align-items: center;
  gap: 12px;
`
