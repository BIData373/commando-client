import styled from "@emotion/styled"
import { ChevronDown } from "lucide-react"
import { useUpsertAssigneeTaskStatus } from "src/api/assignee-task-status/assignee-task-status"
import type { AssigneeStatusDto } from "src/api/model"
import { getListTasksQueryKey } from "src/api/task/task"
import { useWorkspace } from "src/providers/WorkspaceProvider"
import { queryClient } from "src/queryClient"
import { AssigneeAvatar } from "../shared/AssigneeAvatar"
import { StatusTag } from "../shared/StatusTag"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu"

interface AssigneeContainerProps {
	taskId: number
	isAdmin: boolean
	editable: boolean
	assignee: AssigneeStatusDto
}

export const AssigneeContainer = ({
	taskId,
	assignee: { assignee, status },
	isAdmin,
	editable,
}: AssigneeContainerProps) => {
	const {
		workspace: { id: workspaceId, assigneeStatusEditable },
		statuses,
	} = useWorkspace()

	// FIX Get query key from params?
	const { mutateAsync: upsertAssigneeTaskStatus } = useUpsertAssigneeTaskStatus(
		{
			mutation: {
				onSuccess: () => {
					queryClient.invalidateQueries({
						queryKey: getListTasksQueryKey({ workspaceId }),
					})
				},
			},
		},
	)

	const canEdit = editable && (isAdmin || (assigneeStatusEditable ?? false))

	function handleUpdateAssigneeStatus(statusId: number) {
		upsertAssigneeTaskStatus({
			data: { taskId, assigneeId: assignee.id, statusId },
		})
	}

	return (
		<AssigneeRowContainer key={assignee.id} $white={editable && !isAdmin}>
			<AssigneeInfoBlock>
				<AssigneeAvatar assignee={assignee} />
				<AssigneeRoleText>{assignee.name}</AssigneeRoleText>
			</AssigneeInfoBlock>

			{canEdit ? (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<StatusPillTrigger $color={status.color}>
							{status.name}
							<ChevronDown size={12} />
						</StatusPillTrigger>
					</DropdownMenuTrigger>
					<StatusDropdownContent align="center" sideOffset={6}>
						{Object.values(statuses).map((status) => (
							<StatusDropdownItem
								key={status.id}
								$selected={status.id === status?.id}
								onSelect={() => handleUpdateAssigneeStatus(status.id)}
							>
								<StatusTag status={status} />
							</StatusDropdownItem>
						))}
					</StatusDropdownContent>
				</DropdownMenu>
			) : (
				status && <StatusTag status={status} />
			)}
		</AssigneeRowContainer>
	)
}

const StatusPillTrigger = styled.button<{ $color: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 1px 8px;
  border-radius: 56px;
  width: 76px;
  max-width: 76px;
  border: none;
  font-size: 12px;
  line-height: 20px;
  white-space: nowrap;
  cursor: pointer;
  ${({ $color }) => `color: ${$color}`}
  ${({ $color }) => `background:  rgb(from ${$color} r g b / 0.1);`}

  &:focus-visible {
    outline: none;
  }
`

const StatusDropdownContent = styled(DropdownMenuContent)`
  width: 100px;
  min-width: 100px;
  padding: 8px 4px;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: center;
  z-index: 1000;
  box-shadow: 0px 6px 16px rgba(0, 0, 0, 0.08),
    0px 3px 6px rgba(0, 0, 0, 0.12),
    0px 9px 28px rgba(0, 0, 0, 0.05);
`

const StatusDropdownItem = styled(DropdownMenuItem)<{ $selected: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 4px;
  border-radius: 4px;
  background: ${({ $selected }) => ($selected ? "var(--selected-item)" : "transparent")};
  cursor: pointer;
  outline: none;

  &[data-highlighted],
  &:hover {
    background: var(--selected-item);
    color: inherit;
  }
`

const AssigneeRowContainer = styled.div<{ $white?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 24px;
  padding: 7px 12px;
  background: ${({ $white }) => ($white ? "var(--background)" : "var(--background-assignee)")};
  border: 0.5px solid var(--line);
  border-radius: 8px;
  width: 100%;
`

const AssigneeInfoBlock = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
  justify-content: flex-start;
  width: 161px;
`

const AssigneeRoleText = styled.span`
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  color: var(--text-color-2);
  white-space: nowrap;
`
