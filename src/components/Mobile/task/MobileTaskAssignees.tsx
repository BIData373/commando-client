import styled from "@emotion/styled"
import { PermissionType, type TaskWithWorkspaceDto } from "src/api/model"
import { useGetMyPermission } from "src/api/permission/permission"
import { AssigneeContainer } from "src/components/TaskDetail/AssigneeContainer"
import { useCurrentUser } from "src/hooks/useCurrentUser"

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

	const currentUserAssigneStatuses = isAdmin
		? assigneeStatuses
		: assigneeStatuses.filter(({ assignee: { users } }) =>
				users.some(({ upn }) => upn === currentUser.upn),
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
			{currentUserAssigneStatuses.length !== 0 && (
				<AssigneeSection>
					<AssigneeSectionTitle>אחריותך לבצע</AssigneeSectionTitle>
					{currentUserAssigneStatuses.map((assigneeStatus) => (
						<AssigneeContainer
							key={assigneeStatus.assignee.id}
							assignee={assigneeStatus}
							taskId={id}
							workspaceId={workspaceId}
							isAdmin={isAdmin}
						/>
					))}
				</AssigneeSection>
			)}
			{otherUsersAssigneeStatuses.length !== 0 && (
				<AssigneeSection>
					<AssigneeSectionTitle>אחראים אחרים לביצוע</AssigneeSectionTitle>
					{otherUsersAssigneeStatuses.map((assigneeStatus) => (
						<AssigneeContainer
							key={assigneeStatus.assignee.id}
							assignee={assigneeStatus}
							taskId={id}
							workspaceId={workspaceId}
							isAdmin={isAdmin}
						/>
					))}
				</AssigneeSection>
			)}
		</Wrapper>
	)
}

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    border-radius: 8px;
    background: white;
    padding: 1rem;
`

const AssigneeSection = styled.section`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
`

const AssigneeSectionTitle = styled.h2`
    display: flex;
    align-items: center;
    font-size: var(--fs-base);
    font-weight: 500;
    color: var(--text-color-2);
`
