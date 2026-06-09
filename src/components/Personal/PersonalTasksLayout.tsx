import styled from "@emotion/styled"
import type { ColumnDef } from "@tanstack/react-table"
import { isThisWeek } from "date-fns"
import { uniqBy } from "lodash"
import { useMemo, useState } from "react"
import { type WorkspaceDto, WorkspaceStatusType } from "src/api/model"
import {
	getListPersonalTasksQueryKey,
	useListPersonalTasks,
} from "src/api/task/task"
import { useFilteredTasks } from "src/hooks/useFilteredTasks"
import { toTaskRows } from "../../functions/tasks-table"
import {
	type TaskRow,
	useTasksFilters,
} from "../../providers/TasksFiltersProvider"
import { MultiSelectFilterDropdown } from "../shared/MultiSelectFilterDropdown"
import { TasksDatePicker } from "../shared/TasksDatePicker/TasksDatePicker"
import { ColumnHeaderWithActions } from "../Tasks/ColumnHeaderWithActions"
import { EmptyState } from "../Tasks/EmptyState"
import { TaskFilters } from "../Tasks/TaskFilters"
import { TaskTable } from "../Tasks/TaskTable"
import { TooltipProvider } from "../ui/tooltip"
import { MetricsBar } from "./MetricsBar"

type PersonalTaskRow = TaskRow & { workspace: WorkspaceDto }

const WORKSPACE_COLUMN: ColumnDef<PersonalTaskRow> = {
	id: "workspace",
	accessorFn: (row) => row.workspace.title,
	header: ({ column }) => (
		<ColumnHeaderWithActions label="מפקד מנחה" column={column} />
	),
	size: 170,
	enableColumnFilter: false,
	sortingFn: (rowA, rowB) =>
		rowA.original.workspace.title.localeCompare(
			rowB.original.workspace.title,
			"he",
		),
	cell: ({ row }) => {
		const { workspace } = row.original
		return (
			<WorkspaceCell>
				<WorkspaceIconImg
					src={workspace.icon ?? undefined}
					alt={workspace.title}
				/>
				<WorkspaceCellName>{workspace.title}</WorkspaceCellName>
			</WorkspaceCell>
		)
	},
}

const EXTRA_COLUMNS: Record<string, ColumnDef<PersonalTaskRow>> = {
	workspace: WORKSPACE_COLUMN,
}

function PersonalTasksLayout() {
	// const navigate = useNavigate()

	const { searchQuery, clearQuickFilters } = useTasksFilters()

	const queryKey = getListPersonalTasksQueryKey()
	const { data: rawTasks = [], isLoading } = useListPersonalTasks()

	const [activeWorkspaceFilters, setActiveWorkspaceFilters] = useState<
		Set<number>
	>(new Set())

	const taskRows = toTaskRows(rawTasks)

	const workspaces = uniqBy(rawTasks, "workspace.id").map(
		({ workspace }) => workspace,
	)

	const totalCount = taskRows.length

	const notStartedCount = taskRows.filter(
		(t) => t.status?.type === WorkspaceStatusType.NOT_STARTED,
	).length

	const inProgressCount = taskRows.filter(
		(t) => t.status?.type === WorkspaceStatusType.IN_PROGRESS,
	).length

	const weeklyNew = taskRows.filter((t) =>
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
		() => toTaskRows(filteredTasks),
		[filteredTasks],
	)

	const allTaskRows = useMemo(() => toTaskRows(rawTasks), [rawTasks])

	function clearAllFilters() {
		clearQuickFilters()
		setActiveWorkspaceFilters(new Set())
	}

	function handleExport() {
		// placeholder for export
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
					tasks={filteredTaskRows}
					allTasksLength={allTaskRows.length}
					onClearAllFilters={clearAllFilters}
					onExport={handleExport}
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
									<WorkspaceIcon src={ws.icon ?? undefined} alt={ws.title} />
								),
							}))}
							activeValues={activeWorkspaceFilters}
							onApply={setActiveWorkspaceFilters}
							$active={activeWorkspaceFilters.size > 0}
						/>
					}
					startSlot={<TasksDatePicker />}
				/>

				{!isLoading && rawTasks.length === 0 ? (
					<EmptyState />
				) : searchQuery && filteredTasks.length === 0 ? (
					<EmptyState variant="search" />
				) : (
					<TaskTable
						queryKey={queryKey}
						tasks={filteredTaskRows}
						extraColumns={EXTRA_COLUMNS as Record<string, ColumnDef<TaskRow>>}
					/>
				)}
			</PageRoot>
		</TooltipProvider>
	)
}

export default PersonalTasksLayout

const PageRoot = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 32px;
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

const WorkspaceCell = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: flex-start;
`

const WorkspaceCellName = styled.span`
  font-size: var(--fs-btn);
  font-weight: 400;
  line-height: 22px;
  color: var(--text-color);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const WorkspaceIconImg = styled.img`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
`
