import styled from "@emotion/styled";
import { PermissionDtoType } from "src/api/model";
import { useGetMyPermission } from "src/api/permission/permission";
import { useCurrentUser } from "src/hooks/useCurrentUser";
import { useWorkspace } from "src/providers/WorkspaceProvider";
import type { RelatedDirective } from "../Tasks/ResponsibleCell";
import { AssigneeContainer } from "./AssigneeContainer";

interface AssigneeSectionProps {
	relatedDirectives: RelatedDirective[];
	onDirectiveStatusChange: (
		assigneeId: number,
		status: DirectiveStatus,
	) => void;
}

export const AssigneeSection = ({
	relatedDirectives,
	onDirectiveStatusChange,
}: AssigneeSectionProps) => {
	const currentUser = useCurrentUser()

	const { workspace: { id: workspaceId } } = useWorkspace()
	const { data: permission } = useGetMyPermission({ workspaceId })
	const isAdmin = permission?.type === PermissionDtoType.MANAGER;

	const myGroups = relatedDirectives.filter((d) =>
		d.assignee.userIds.includes(currentUser.id),
	);
	const otherGroups = relatedDirectives.filter(
		(d) => !d.assignee.userIds.includes(currentUser.id),
	);

	const headerGroup = isAdmin ? relatedDirectives : myGroups;

	const isMultiple = relatedDirectives.length >= 2;
	return (
		<Section>
			<SectionLabel>
				{isAdmin
					? isMultiple
						? "אחראים לביצוע"
						: "אחראי לביצוע"
					: "אחריותך לבצע"}
			</SectionLabel>
			{headerGroup.length === 0 ? (
				<SectionValue>לא הוגדר</SectionValue>
			) : (
				<AssigneesContainer>
					<AssigneeRowsList>
						{headerGroup.map((item) => (
							<AssigneeContainer
								key={item.assignee.id}
								assignee={item}
								isAdmin={isAdmin}
								editable={true}
								onDirectiveStatusChange={onDirectiveStatusChange}
							/>
						))}
					</AssigneeRowsList>
				</AssigneesContainer>
			)}
			{!isAdmin && otherGroups.length > 0 && (
				<>
					<SectionLabel>אחראים נוספים לביצוע</SectionLabel>
					<AssigneesContainer>
						<AssigneeRowsList>
							{otherGroups.map((item) => (
								<AssigneeContainer
									key={item.assignee.id}
									assignee={item}
									isAdmin={isAdmin}
									editable={false}
									onDirectiveStatusChange={onDirectiveStatusChange}
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
