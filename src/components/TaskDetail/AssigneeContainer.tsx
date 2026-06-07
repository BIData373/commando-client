import styled from "@emotion/styled"
import { useUpsertAssigneeTaskStatus } from "src/api/assignee-task-status/assignee-task-status"
import type { AssigneeStatusDto } from "src/api/model"
import { getGetTaskQueryKey } from "src/api/task/task"
import { useWorkspace } from "src/providers/WorkspaceProvider"
import { queryClient } from "src/queryClient"
import { AssigneeAvatar } from "../shared/AssigneeAvatar"
import { StatusTag } from "../shared/StatusTag"
import { StatusDropdown } from "../Tasks/StatusDropdown"

interface AssigneeContainerProps {
	taskId: number
	isAdmin: boolean
	editable: boolean
	assignee: AssigneeStatusDto
}

export const AssigneeContainer = ({
	taskId,
	assignee: { assignee, status, description },
	isAdmin,
	editable,
}: AssigneeContainerProps) => {
	const {
		workspace: { id: workspaceId, assigneeStatusEditable },
	} = useWorkspace()

	// FIX Get query key from params?
	const { mutateAsync: upsertAssigneeTaskStatus } = useUpsertAssigneeTaskStatus(
		{
			mutation: {
				onSuccess: () => {
					queryClient.invalidateQueries({
						queryKey: getGetTaskQueryKey({ id: taskId }),
					})
				},
			},
		},
	)

	const canEdit = editable && (isAdmin || (assigneeStatusEditable ?? false))

	function handleUpdateAssigneeStatus(
		taskId: number,
		assigneeId: number,
		statusId: number,
	) {
		upsertAssigneeTaskStatus({
			data: { taskId, assigneeId, statusId },
		})
	}

	return (
		<AssigneeRowContainer key={assignee.id} $white={editable && !isAdmin}>
			<AssigneeInfoBlock>
				<AssigneeAvatar assignee={assignee} />
				<AssigneeRoleText>{assignee.name}</AssigneeRoleText>
			</AssigneeInfoBlock>

			<StatusBlock>
				{canEdit ? (
					<StatusDropdown
						status={status}
						taskId={taskId}
						assigneeId={assignee.id}
						workspaceId={workspaceId}
						onUpdate={handleUpdateAssigneeStatus}
						withArrow
					/>
				) : (
					status && <StatusTag status={status} />
				)}
			</StatusBlock>

			{description && <DescriptionText>{description}</DescriptionText>}
		</AssigneeRowContainer>
	)
}

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

const StatusBlock = styled.div`
  flex-shrink: 0;
`

const AssigneeRoleText = styled.span`
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  color: var(--text-color-2);
  white-space: nowrap;
`

const DescriptionText = styled.span`
  font-size: 13px;
  font-weight: 400;
  line-height: 20px;
  color: var(--text-color-2);
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`
