import styled from "@emotion/styled"
import { useNavigate } from "@tanstack/react-router"
import { getListTasksQueryKey, useListTasks } from "src/api/task/task"
import { useFilteredTasks } from "src/hooks/useFilteredTasks"
import { useWorkspace } from "src/providers/WorkspaceProvider"
import { invalidateQueries } from "src/queryClient"
import { toTaskRows } from "src/utils/task-table-utils"
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

	const tasksQueryKey = getListTasksQueryKey({ workspaceId: id })
	const { data: rawTasks = [] } = useListTasks({ workspaceId: id })

	const filteredTasks = useFilteredTasks(rawTasks)

	const tasks = toTaskRows(
		[...filteredTasks].sort(
			(a, b) => b.updatedAt.getTime() - a.updatedAt.getTime(),
		),
	)

	function handleSetAssignees() {
		navigate({
			to: "/workspace/$urlName/settings/assignees",
			params: { urlName },
		})
	}

	function handleUpdateSuccess() {
		invalidateQueries([tasksQueryKey])
	}

	return (
		<ContentArea>
			<TasksDatePicker />

			<GridLayout>
				<FocusedInstructions
					onUpdateStatusSuccess={handleUpdateSuccess}
					tasks={tasks}
				/>
				<StatusCard tasks={tasks} />
				<RecentlyCompleted
					onUpdateStatusSuccess={handleUpdateSuccess}
					tasks={tasks}
				/>
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
    grid-auto-flow: dense;
    gap: 48px 24px;
  }
`
