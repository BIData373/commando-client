import styled from "@emotion/styled"
import { useNavigate } from "@tanstack/react-router"
import { useState } from "react"
import { WorkspaceStatusType } from "src/api/model"
import {
	getListTasksQueryKey,
	useGetTask,
	useListTasks,
} from "src/api/task/task"
import { useFilteredTasks } from "src/hooks/useFilteredTasks"
import { useWorkspace } from "src/providers/WorkspaceProvider"
import { invalidateQueries } from "src/queryClient"
import { toTaskRows } from "src/utils/task-table-utils"
import { CreateTaskButton } from "../shared/CreateTaskButton"
import { TasksDatePicker } from "../shared/TasksDatePicker/TasksDatePicker"
import TaskDetailPanel from "../TaskDetail/TaskDetailPanel"
import FocusedInstructions from "./FocusedInstructions"
import RecentlyCompleted from "./RecentlyCompleted"
import StatusCard from "./StatusCard"
import SystemDistribution from "./SystemDistribution"

interface TaskDetailLoaderProps {
	taskId: number
	onClose(): void
	onEdit(): void
}

function TaskDetailLoader({ taskId, onClose, onEdit }: TaskDetailLoaderProps) {
	const { data: task } = useGetTask({ id: taskId })
	return (
		task && <TaskDetailPanel task={task} onClose={onClose} onEdit={onEdit} />
	)
}

export function DashboardContent() {
	const {
		workspace: { id, urlName },
	} = useWorkspace()

	const navigate = useNavigate()
	const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null)

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

	function handleTaskDoubleClick(taskId: number) {
		setSelectedTaskId(taskId)
	}

	function handleTaskDetailClose() {
		setSelectedTaskId(null)
	}

	function handleTaskDetailEdit() {
		if (selectedTaskId == null) return
		navigate({
			to: "/workspace/$urlName/tasks/$taskId/edit",
			params: { urlName, taskId: String(selectedTaskId) },
		})
	}

	return (
		<ContentArea>
			<ButtonGroup>
				<CreateTaskButton context="dashboard" />
				<TasksDatePicker />
			</ButtonGroup>

			<GridLayout>
				<FocusedInstructions
					onUpdateStatusSuccess={handleUpdateSuccess}
					onTaskDoubleClick={handleTaskDoubleClick}
					tasks={tasks.filter(
						({ status }) => status?.type !== WorkspaceStatusType.COMPLETED,
					)}
				/>
				<StatusCard tasks={tasks} />
				<RecentlyCompleted
					onUpdateStatusSuccess={handleUpdateSuccess}
					onTaskDoubleClick={handleTaskDoubleClick}
					tasks={tasks}
				/>
				<SystemDistribution onSetAssignees={handleSetAssignees} tasks={tasks} />
			</GridLayout>

			{selectedTaskId != null && (
				<TaskDetailLoader
					taskId={selectedTaskId}
					onClose={handleTaskDetailClose}
					onEdit={handleTaskDetailEdit}
				/>
			)}
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
    margin-block-start: 28px;
  }
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

  @media (max-width: 1300px) {
    grid-template-columns: 1fr 1fr;
    grid-auto-flow: dense;
    gap: 48px 24px;
  }
`
