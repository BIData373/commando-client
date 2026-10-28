import styled from "@emotion/styled"
import { PermissionType, type TaskWithWorkspaceDto } from "src/api/model"
import { useGetMyPermission } from "src/api/permission/permission"
import { useCurrentUser } from "src/hooks/useCurrentUser"
import { MobileTaskAssigneeSection } from "./MobileTaskAssigneeSection"

interface MobileTaskAssignees {
	task: TaskWithWorkspaceDto
}

export function MobileTaskAssignees({
	task: {
		id,
		assigneeStatuses,
		workspace: { id: workspaceId },
	},
}: MobileTaskAssignees) {
	const currentUser = useCurrentUser()

	const { data: permission } = useGetMyPermission({ workspaceId })

	const isAdmin = permission?.type === PermissionType.MANAGER

	const currentUserAssigneStatuses = assigneeStatuses.filter(
		({ assignee: { users } }) =>
			isAdmin || users.some(({ upn }) => upn === currentUser.upn),
	)

	const otherUsersAssigneeStatuses = assigneeStatuses.filter(
		({ assignee: otherAssignee }) =>
			!currentUserAssigneStatuses.some(
				({ assignee: currentAssignee }) =>
					otherAssignee.id === currentAssignee.id,
			),
	)

	return (
		<Wrapper>
			<MobileTaskAssigneeSection
				title="אחריותך לבצע"
				assigneeStatuses={currentUserAssigneStatuses}
				taskId={id}
				workspaceId={workspaceId}
				isAdmin={isAdmin}
			/>
			<MobileTaskAssigneeSection
				title="אחראים אחרים לביצוע"
				assigneeStatuses={otherUsersAssigneeStatuses}
				taskId={id}
				workspaceId={workspaceId}
				isAdmin={isAdmin}
			/>
		</Wrapper>
	)
}

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    border-radius: 8px;
    background: var(--background);
    padding: 1rem;
`
