import styled from "@emotion/styled";
import { useParams } from "@tanstack/react-router";
import { type IUser, UserRole } from "src/types";
import { useWorkspaceSettings } from "../../hooks/useWorkspaceSettings";
import type { DirectiveStatus } from "../shared/StatusTag";
import type { RelatedDirective } from "../Tasks/ResponsibleCell";
import { AssigneeContainer } from "./AssigneeContainer";

interface AssigneeSectionProps {
	currentUser: IUser;
	status: DirectiveStatus;
	relatedDirectives: RelatedDirective[];
	onDirectiveStatusChange: (
		assigneeId: number,
		status: DirectiveStatus,
	) => void;
}

export const AssigneeSection = ({
	currentUser,
	relatedDirectives,
	onDirectiveStatusChange,
}: AssigneeSectionProps) => {
	const { urlName } = useParams({ from: "/workspace/$urlName/tasks/$taskId" });
	const { data: workspaceSettings } = useWorkspaceSettings(urlName);
	const isAdmin = currentUser.role === UserRole.ADMIN;

	const myGroups = relatedDirectives.filter((d) =>
		d.user.userIds.includes(currentUser.id),
	);
	const otherGroups = relatedDirectives.filter(
		(d) => !d.user.userIds.includes(currentUser.id),
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
								key={item.user.id}
								assignee={item}
								isAdmin={isAdmin}
								editable={true}
								workspaceSettings={workspaceSettings}
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
									key={item.user.id}
									assignee={item}
									isAdmin={isAdmin}
									editable={false}
									workspaceSettings={workspaceSettings}
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
