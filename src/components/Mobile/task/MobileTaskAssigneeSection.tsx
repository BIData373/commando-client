import styled from "@emotion/styled"
import type { AssigneeStatusDto } from "src/api/model"
import { AssigneeContainer } from "src/components/TaskDetail/AssigneeContainer"

interface MobileTaskAssigneeSectionProps {
	title: string
	assigneeStatuses: AssigneeStatusDto[]
	taskId: number
	workspaceId: number
	isAdmin: boolean
}

export function MobileTaskAssigneeSection({
	title,
	assigneeStatuses,
	taskId,
	workspaceId,
	isAdmin,
}: MobileTaskAssigneeSectionProps) {
	if (assigneeStatuses.length === 0) return null

	return (
		<AssigneeSection>
			<AssigneeSectionTitle>{title}</AssigneeSectionTitle>
			{assigneeStatuses.map((assigneeStatus) => (
				<AssigneeContainer
					key={assigneeStatus.assignee.id}
					assignee={assigneeStatus}
					taskId={taskId}
					workspaceId={workspaceId}
					isAdmin={isAdmin}
				/>
			))}
		</AssigneeSection>
	)
}

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
