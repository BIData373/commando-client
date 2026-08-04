import styled from "@emotion/styled"
import { useNavigate } from "@tanstack/react-router"
import { useListTaskRows } from "src/api/task/task"
import { useFilteredTasks } from "src/hooks/useFilteredTasks"
import { useWorkspace } from "src/providers/WorkspaceProvider"
import { invalidateQueries } from "src/queryClient"
import { CreateTaskButton } from "../shared/CreateTaskButton"
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

	const { data: taskRows = [], queryKey } = useListTaskRows({ workspaceId: id })

	const filteredTasks = useFilteredTasks(taskRows, { skipQuickFilters: true })

	const tasks = [...filteredTasks].sort(
		(a, b) => b.updatedAt.getTime() - a.updatedAt.getTime(),
	)

	function handleSetAssignees() {
		navigate({
			to: "/workspace/$urlName/settings/assignees",
			params: { urlName },
		})
	}

	function handleUpdateSuccess() {
		invalidateQueries([queryKey])
	}

	function handleOpenTask(taskId: number) {
		navigate({
			to: "/workspace/$urlName/dashboard/task/$taskId",
			params: { urlName, taskId: String(taskId) },
		})
	}

	return (
		<ContentArea>
			<ButtonGroup>
				<CreateTaskButton context="dashboard" />
				<TasksDatePicker showPlaceholder />
			</ButtonGroup>

			<GridLayout>
				<FocusedInstructions
					onUpdateStatusSuccess={handleUpdateSuccess}
					onClick={handleOpenTask}
					taskRows={tasks}
				/>
				<StatusCard tasks={tasks} />
				<RecentlyCompleted
					onUpdateStatusSuccess={handleUpdateSuccess}
					onClick={handleOpenTask}
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
  padding-top: 12px;
`

const ButtonGroup = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  `

const GridLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 450px;
  gap: 62px;
  margin-top: 28px;

  @media (max-width: 1300px) {
    grid-template-columns: 1fr 1fr;
    grid-auto-flow: dense;
    gap: 48px 24px;
  }
`
