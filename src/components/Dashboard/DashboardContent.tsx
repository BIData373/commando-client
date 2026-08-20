import styled from "@emotion/styled"
import { useNavigate } from "@tanstack/react-router"
import { useState } from "react"
import { useListAssignees } from "src/api/assignee/assignee"
import { PermissionType, type TaskRowDto } from "src/api/model"
import { useGetMyPermission } from "src/api/permission/permission"
import { useListTaskRows } from "src/api/task/task"
import { useFilteredTasks } from "src/hooks/useFilteredTasks"
import { useWorkspace } from "src/providers/WorkspaceProvider"
import { invalidateQueries } from "src/queryClient"
import { CreateTaskButton } from "../shared/CreateTaskButton"
import { TasksDatePicker } from "../shared/TasksDatePicker/TasksDatePicker"
import { AssigneeFilterDropdown } from "./AssigneeFilterDropdown/AssigneeFilterDropdown"
import FocusedInstructions from "./FocusedInstructions"
import RecentlyCompleted from "./RecentlyCompleted"
import StatusCard from "./StatusCard"
import SystemDistribution from "./SystemDistribution"

export function DashboardContent() {
	const {
		workspace: { id, urlName },
	} = useWorkspace()

	const navigate = useNavigate()

	const [selectedAssigneeIds, setSelectedAssigneeIds] = useState<number[]>([])

	const { data: taskRows = [], queryKey } = useListTaskRows({ workspaceId: id })

	const { data: myPermission } = useGetMyPermission({ workspaceId: id })

	const { data: assignees = [] } = useListAssignees({ workspaceId: id })

	const selectedAssigneeNames = assignees
		.filter((assignee) => selectedAssigneeIds.includes(assignee.id))
		.map((assignee) => assignee.name)

	const filteredTasks = useFilteredTasks(taskRows, {
		skipQuickFilters: true,
		additionalFilter: (task) =>
			matchesAssigneeFilter(task, selectedAssigneeIds),
	})

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

	function matchesAssigneeFilter(task: TaskRowDto, assigneeIds: number[]) {
		if (assigneeIds.length === 0) return true

		return task.assignee ? assigneeIds.includes(task.assignee.id) : false
	}

	return (
		<ContentArea>
			<ButtonGroup>
				{myPermission?.type === PermissionType.MANAGER && (
					<CreateTaskButton context="dashboard" />
				)}

				<FilterSlot>
					<AssigneeFilterDropdown
						workspaceId={id}
						selectedIds={selectedAssigneeIds}
						onApply={setSelectedAssigneeIds}
					/>
				</FilterSlot>

				<DatePickerSlot>
					<TasksDatePicker showPlaceholder />
				</DatePickerSlot>
			</ButtonGroup>

			<GridLayout>
				<FocusedInstructions
					onUpdateStatusSuccess={handleUpdateSuccess}
					onClick={handleOpenTask}
					taskRows={tasks}
					assigneeFilter={selectedAssigneeNames}
				/>
				<StatusCard tasks={tasks} />
				<RecentlyCompleted
					onUpdateStatusSuccess={handleUpdateSuccess}
					onClick={handleOpenTask}
					tasks={tasks}
					assigneeFilter={selectedAssigneeNames}
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
  padding-top: 24px;
`

const ButtonGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  `

const FilterSlot = styled.div`
  margin-inline-start: auto;
  `

const DatePickerSlot = styled.div``

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
