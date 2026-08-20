import styled from "@emotion/styled"
import { useUpsertAssigneeTaskStatus } from "src/api/assignee-task-status/assignee-task-status"
import type { AssigneeStatusDto } from "src/api/model"
import {
	getGetTaskQueryKey,
	getListPersonalTaskRowsQueryKey,
	getListTaskRowsQueryKey,
} from "src/api/task/task"
import { useListWorkspaceStatuses } from "src/api/workspace-status/workspace-status"
import { invalidateQueries } from "src/queryClient"
import { AssigneeAvatar } from "../shared/AssigneeAvatar"
import { AssigneeDetailPopover } from "../shared/AssigneeDetailPopover"
import { StatusDropdown } from "../Tasks/StatusDropdown"

interface AssigneeContainerProps {
	taskId: number
	workspaceId: number
	isAdmin: boolean
	editable: boolean
	assignee: AssigneeStatusDto
}

export const AssigneeContainer = ({
	taskId,
	workspaceId,
	assignee: { assignee, status, description },
	isAdmin,
	editable,
}: AssigneeContainerProps) => {
	const { data: statuses = [] } = useListWorkspaceStatuses({ workspaceId })

	const { mutateAsync: upsertAssigneeTaskStatus } = useUpsertAssigneeTaskStatus(
		{
			mutation: {
				onSuccess: () => {
					invalidateQueries([
						getGetTaskQueryKey({ id: taskId }),
						getListTaskRowsQueryKey({ workspaceId }),
						getListPersonalTaskRowsQueryKey(),
					])
				},
			},
		},
	)

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
		<AssigneeRowContainer $enabled={editable && !isAdmin}>
			<AssigneeInfoBlock>
				<AssigneeDetailPopover assignee={assignee}>
					<AssigneeAvatar assignee={assignee} cursor />
				</AssigneeDetailPopover>
				<AssigneeRoleText title={assignee.name}>
					{assignee.name}
				</AssigneeRoleText>
			</AssigneeInfoBlock>

			<StatusBlock>
				{status && (
					<StatusDropdown
						status={status}
						statuses={statuses}
						taskId={taskId}
						assigneeId={assignee.id}
						editable={editable}
						onUpdate={handleUpdateAssigneeStatus}
					/>
				)}
			</StatusBlock>

			{description && <DescriptionText>{description}</DescriptionText>}
		</AssigneeRowContainer>
	)
}

const AssigneeRowContainer = styled.div<{ $enabled?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 24px;
  padding: 7px 12px;
  background: ${({ $enabled }) => ($enabled ? "var(--background)" : "var(--background-area)")};
  border: 0.8px solid var(--line);
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
  font-size: var(--fs-btn);
  font-weight: 400;
  line-height: 22px;
  color: var(--text-color-2);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const DescriptionText = styled.span`
  font-size: 13px;
  font-weight: 400;
  line-height: 20px;
  color: var(--text-color-2);
  flex: 1;
  min-width: 0;
  max-height: 3lh;
  overflow-y: auto;
  direction: rtl;
  word-break: break-word;
`
