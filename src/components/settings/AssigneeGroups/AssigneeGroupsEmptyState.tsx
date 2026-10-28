import styled from "@emotion/styled"
import { Plus } from "lucide-react"
import assigneeGroupsIcon from "../../../assets/icons/assignee-groups.svg"
import { EmptyCardState } from "../../shared/EmptyCardState"
import { SecondaryButton } from "../../shared/SecondaryButton"

interface AssigneeGroupsEmptyStateProps {
	onOpenCreateDialog(): void
}

export function AssigneeGroupsEmptyState({
	onOpenCreateDialog,
}: AssigneeGroupsEmptyStateProps) {
	return (
		<EmptyStateContainer>
			<EmptyCardState
				imgSrc={assigneeGroupsIcon}
				title="טרם הוגדרו רשימות תפוצה"
				description={"הוסף רשימת אחראים כדי לשייך בקלות מספר\nאחראים להנחיה"}
			/>
			<SecondaryButton
				onClick={onOpenCreateDialog}
				height={32}
				title={
					<>
						<Plus size={16} />
						הוספת רשימת תפוצה
					</>
				}
			/>
		</EmptyStateContainer>
	)
}

const EmptyStateContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
`
