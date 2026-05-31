import styled from "@emotion/styled";
import { type AssigneeStatusDto, PermissionDtoType } from "src/api/model";
import { useGetMyPermission } from "src/api/permission/permission";
import { useCurrentUser } from "src/hooks/useCurrentUser";
import { useWorkspace } from "src/providers/WorkspaceProvider";
import { AssigneeContainer } from "./AssigneeContainer";

interface AssigneeSectionProps {
	taskId: number
	assigneeStatuses: AssigneeStatusDto[]
}

export const AssigneeSection = ({ taskId, assigneeStatuses }: AssigneeSectionProps) => {
	const currentUser = useCurrentUser()
	const { workspace: { id: workspaceId } } = useWorkspace()

	const { data: permission } = useGetMyPermission({ workspaceId })

	const isAdmin = permission?.type === PermissionDtoType.MANAGER;

	const currentUserAssigneStatuses = isAdmin
		? assigneeStatuses
		: assigneeStatuses.filter(
			({ assignee: { users } }) => users.some(({ id }) => id === currentUser.id)
		)

	const otherUsersAssigneeStatuses = assigneeStatuses.filter(
		({ assignee: otherAssignee }) => !currentUserAssigneStatuses.some(
			({ assignee: currentAssignee }) => otherAssignee.id === currentAssignee.id
		)
	)

	const isMultiple = assigneeStatuses.length >= 2;

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
								assigneeStatus={item}
								isAdmin={isAdmin}
								editable={true}
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
									assigneeStatus={item}
									isAdmin={isAdmin}
									editable={false}
								/>
							))}
						</AssigneeRowsList>
					</AssigneesContainer>
				</>
			)}
		</Section>
	);
};

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  align-items: flex-start;
`;

const SectionLabel = styled.p`
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
  color: var(--sea-ink);
  text-align: end;
  white-space: nowrap;
`;

const SectionValue = styled.p`
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  color: var(--text-color);
  text-align: end;
`;

const AssigneesContainer = styled.div`
  width: 100%;
`;

const AssigneeRowsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
`;
