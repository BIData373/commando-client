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
		<StyledEmptyState
			imgSrc={assigneeGroupsIcon}
			title="טרם הוגדרו רשימות תפוצה"
			description={"הוסף רשימת אחראים כדי לשייך בקלות מספר\nאחראים להנחיה"}
			action={
				<CreateButton
					onClick={onOpenCreateDialog}
					height={32}
					title={
						<>
							<Plus size={16} />
							הוספת רשימת תפוצה
						</>
					}
				/>
			}
		/>
	)
}

const StyledEmptyState = styled(EmptyCardState)`
  gap: 4px;
  padding-top: 0;
`

const CreateButton = styled(SecondaryButton)`
  margin-top: 20px;
`
