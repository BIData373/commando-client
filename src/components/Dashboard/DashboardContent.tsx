import styled from "@emotion/styled"
import { useNavigate } from "@tanstack/react-router"
import { getListTasksQueryKey, useListTasks } from "src/api/task/task"
import { toTaskRows } from "src/functions/tasks-table"
import { useFilteredTasks } from "src/hooks/useFilteredTasks"
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
		workspace: { id, urlName },
	} = useWorkspace()

	const navigate = useNavigate()

	const { dateType } = useTasksFilters()

	const tasksQueryKey = getListTasksQueryKey({ workspaceId: id })
	const { data: rawTasks = [] } = useListTasks({ workspaceId: id })

	const filteredTasks = useFilteredTasks(rawTasks)

	const tasks = toTaskRows(
		dateType === DATE_TYPE.UPDATED_DATE
			? [...filteredTasks].sort(
					(a, b) => b.updatedAt.getTime() - a.updatedAt.getTime(),
				)
			: filteredTasks,
	)

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
				<FocusedInstructions queryKey={tasksQueryKey} tasks={tasks} />
				<StatusCard tasks={tasks} />
				<RecentlyCompleted queryKey={tasksQueryKey} tasks={tasks} />
				<SystemDistribution onSetAssignees={handleSetAssignees} tasks={tasks} />
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
