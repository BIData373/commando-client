import styled from "@emotion/styled"
import { useNavigate, useParams } from "@tanstack/react-router"
import { useMemo } from "react"
import { getListTasksQueryKey, useListTasks } from "src/api/task/task"
import { applyDateFilter } from "src/functions/filter-utils"
import { toTaskRows } from "src/functions/tasks-table"
import { useTasksFilters } from "src/providers/TasksFiltersProvider"
import { useWorkspace } from "src/providers/WorkspaceProvider"
import { DATE_TYPE } from "src/utils/date-utils"
import { TasksDatePicker } from "../shared/TasksDatePicker/TasksDatePicker"
import FocusedInstructions from "./FocusedInstructions"
import RecentlyCompleted from "./RecentlyCompleted"
import StatusCard from "./StatusCard"
import SystemDistribution from "./SystemDistribution"

export function DashboardContent() {
	const {
		workspace: { id },
	} = useWorkspace()
	const { urlName } = useParams({ from: "/workspace/$urlName" })
	const navigate = useNavigate()

	const { dateType, dateRange } = useTasksFilters()

	const tasksQueryKey = getListTasksQueryKey({ workspaceId: id })
	const { data: rawTasks = [] } = useListTasks({ workspaceId: id })
	const tasks = useMemo(() => toTaskRows(rawTasks), [rawTasks])

	const filteredTasks = useMemo(() => {
		let filtered = applyDateFilter(tasks, dateType, dateRange)

		if (dateType === DATE_TYPE.UPDATED_DATE) {
			filtered = [...filtered].sort(
				(a, b) =>
					new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
			)
		}

		return filtered
	}, [tasks, dateRange, dateType])

	function handleSetAssignees() {
		navigate({
			to: "/workspace/$urlName/settings/assignees",
			params: { urlName },
		})
	}

	return (
		<ContentArea>
			<TasksDatePicker showTitle={true} />

			<GridLayout>
				<FocusedInstructions
					queryKey={tasksQueryKey}
					urlName={urlName}
					tasks={filteredTasks}
				/>
				<StatusCard tasks={filteredTasks} />
				<RecentlyCompleted
					queryKey={tasksQueryKey}
					urlName={urlName}
					tasks={filteredTasks}
				/>
				<SystemDistribution
					onSetAssignees={handleSetAssignees}
					tasks={filteredTasks}
				/>
			</GridLayout>
		</ContentArea>
	)
}

const ContentArea = styled.div`
  display: flex;
  flex-direction: column;
  padding-block-end: 32px;
  color: var(--sea-ink-soft);
  margin-top: 16px;

  & > *:nth-of-type(1) {
    margin-block-start: 14px;
  }

  & > *:nth-of-type(2) {
    margin-block-start: 72px;
  }
`

const GridLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 450px;
  gap: 72px;

  @media (max-width: 1300px) {
    grid-template-columns: 1fr 1fr;
    gap: 48px 24px;
  }
`
