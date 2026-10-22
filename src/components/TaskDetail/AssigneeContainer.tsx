import { css } from "@emotion/react"
import styled from "@emotion/styled"
import type { AssigneeStatusDto } from "src/api/model"
import { useListWorkspaceStatuses } from "src/api/workspace-status/workspace-status"
import { useIsMobile } from "src/hooks/use-mobile"
import { useCurrentUser } from "src/hooks/useCurrentUser"
import { useUpdateTaskStatus } from "src/hooks/useUpdateTaskStatus"
import { AssigneeAvatar } from "../shared/AssigneeAvatar"
import { AssigneeDetailPopover } from "../shared/AssigneeDetailPopover"
import { StatusDropdown } from "../Tasks/StatusDropdown"

interface AssigneeContainerProps {
	taskId: number
	workspaceId: number
	isAdmin: boolean
	assignee: AssigneeStatusDto
}

export const AssigneeContainer = ({
	taskId,
	workspaceId,
	assignee: {
		assignee,
		status,
		description,
		editable,
		personalArchivedAt,
		workspaceArchivedAt,
	},
	isAdmin,
}: AssigneeContainerProps) => {
	const currentUser = useCurrentUser()

	const isMobile = useIsMobile()

	const { data: statuses = [] } = useListWorkspaceStatuses({ workspaceId })

	const handleUpdateAssigneeStatus = useUpdateTaskStatus({ notify: true })

	const isCurrentUserTask = assignee.users.some(
		(user) => user.upn === currentUser.upn,
	)

	const taskVariant = isMobile
		? isAdmin
			? "currentUserMobile"
			: isCurrentUserTask
				? "currentUserMobile"
				: "otherUserMobile"
		: "default"

	return (
		<AssigneeRowContainer
			$enabled={editable && !isAdmin}
			$isMobile={isMobile}
			$isCurrentUserTask={isCurrentUserTask}
			$variant={taskVariant}
			$isAdmin={isAdmin}
		>
			<AssigneeInfoBlock>
				<AssigneeDetailPopover assignee={assignee}>
					<AssigneeAvatar
						assignee={assignee}
						cursor
						size={isMobile ? 24 : 32}
					/>
				</AssigneeDetailPopover>
				<AssigneeRoleText title={assignee.name}>
					{assignee.name}
				</AssigneeRoleText>
			</AssigneeInfoBlock>

			<StatusBlock $isMobile={isMobile}>
				{status && (
					<StatusDropdown
						isCurrentUserTask={isCurrentUserTask}
						status={status}
						statuses={statuses}
						taskId={taskId}
						assigneeId={assignee.id}
						editable={editable}
						isArchived={!!personalArchivedAt || !!workspaceArchivedAt}
						onUpdate={handleUpdateAssigneeStatus}
						isAdmin={isAdmin}
					/>
				)}
			</StatusBlock>

			{description && <DescriptionText>{description}</DescriptionText>}
		</AssigneeRowContainer>
	)
}

const cardVariants = {
	default: css`
		--container-flex-direction: row;
		--container-align-items: center;
		--container-gap: 24px;
		--container-border: 0.8px solid var(--line);

		--status-block-order: 0;
		--status-block-width: auto;

		--assignee-role-font-size: var(--fs-btn);
		--assignee-role-font-weight: 400;
		--assignee-role-color: var(--text-color-2);

		--description-font-size: 13px;
		--description-color: var(--text-color-2);
	`,
	currentUserMobile: css`
		--container-flex-direction: column;
		--container-align-items: flex-start;
		--container-gap: 8px;
		--container-border: 0.8px solid var(--line);

		--status-block-order: 1;
		--status-block-width: 100%;

		--assignee-role-font-size: var(--fs-btn);
		--assignee-role-font-weight: 500;
		--assignee-role-color: var(--text-color-2);

		--description-font-size: var(--fs-base);
		--description-color: var(--text-color-2);
	`,
	otherUserMobile: css`
		--container-flex-direction: column;
		--container-align-items: flex-start;
		--container-gap: 8px;
		--container-border: none;

		--status-block-order: 1;
		--status-block-width: auto;

		--assignee-role-font-size: var(--fs-base);
		--assignee-role-font-weight: 500;
		--assignee-role-color: var(--text-color);

		--description-font-size: var(--fs-base);
		--description-color: var(--text-color);
	`,
} as const

const AssigneeRowContainer = styled.div<{
	$variant: keyof typeof cardVariants
	$enabled?: boolean
	$isMobile?: boolean
	$isCurrentUserTask?: boolean
	$isAdmin?: boolean
}>`
  ${({ $variant }) => $variant && cardVariants[$variant]}

  display: flex;
  flex-direction: var(--container-flex-direction);
  align-items: var(--container-align-items);
  justify-content: flex-start;
  gap: var(--container-gap);
  padding: 7px 12px;
  background: ${({ $enabled, $isMobile, $isCurrentUserTask, $isAdmin }) =>
		($isMobile ? $isAdmin || $isCurrentUserTask : $enabled)
			? "var(--background)"
			: "var(--background-area)"};
  border: var(--container-border);
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

const StatusBlock = styled.div<{ $isMobile: boolean }>`
  order: var(--status-block-order);
  flex-shrink: 0;
  width: var(--status-block-width);
`

const AssigneeRoleText = styled.span`
  font-size: var(--assignee-role-font-size);
  font-weight: var(--assignee-role-font-weight);
  line-height: 22px;
  color: var(--assignee-role-color);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const DescriptionText = styled.span`
  font-size: var(--description-font-size);
  font-weight: 400;
  line-height: 20px;
  color: var(--description-color);
  flex: 1;
  min-width: 0;
  max-height: 3lh;
  overflow-y: auto;
  direction: rtl;
  word-break: break-word;
`
