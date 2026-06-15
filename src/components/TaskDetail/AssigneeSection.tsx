import styled from "@emotion/styled"
import { type AssigneeStatusDto, PermissionType } from "src/api/model"
import { useGetMyPermission } from "src/api/permission/permission"
import { useCurrentUser } from "src/hooks/useCurrentUser"
import { AssigneeContainer } from "./AssigneeContainer"

interface AssigneeSectionProps {
	taskId: number
	workspaceId: number
	assigneeStatuses: AssigneeStatusDto[]
}

export const AssigneeSection = ({
	taskId,
	workspaceId,
	assigneeStatuses,
}: AssigneeSectionProps) => {
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

	const isMultiple = assigneeStatuses.length >= 2

	return (
		<Section>
			<SectionLabel>
				{isAdmin
					? isMultiple
						? "אחראים לביצוע"
						: "אחראי לביצוע"
					: "אחריותך לבצע"}
			</SectionLabel>
			{currentUserAssigneStatuses.length === 0 ? (
				<SectionValue>לא הוגדר</SectionValue>
			) : (
				<AssigneesContainer>
					<AssigneeRowsList>
						{currentUserAssigneStatuses.map((item) => (
							<AssigneeContainer
								key={item.assignee.id}
								taskId={taskId}
								workspaceId={workspaceId}
								assignee={item}
								isAdmin={isAdmin}
								editable={item.editable}
							/>
						))}
					</AssigneeRowsList>
				</AssigneesContainer>
			)}
			{!isAdmin && otherUsersAssigneeStatuses.length > 0 && (
				<>
					<SectionLabel>אחראים נוספים לביצוע</SectionLabel>
					<AssigneesContainer>
						<AssigneeRowsList>
							{otherUsersAssigneeStatuses.map((item) => (
								<AssigneeContainer
									key={item.assignee.id}
									taskId={taskId}
									workspaceId={workspaceId}
									assignee={item}
									isAdmin={isAdmin}
									editable={item.editable}
								/>
							))}
						</AssigneeRowsList>
					</AssigneesContainer>
				</>
			)}
		</Section>
	)
}

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  align-items: flex-start;
`

const SectionLabel = styled.p`
  font-size: var(--fs-base);
  font-weight: 500;
  line-height: 24px;
  color: var(--sea-ink);
  text-align: end;
  white-space: nowrap;
`

const SectionValue = styled.p`
  font-size: var(--fs-btn);
  font-weight: 400;
  line-height: 22px;
  color: var(--text-color);
  text-align: end;
`

const AssigneesContainer = styled.div`
  width: 100%;
`

const AssigneeRowsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
`
