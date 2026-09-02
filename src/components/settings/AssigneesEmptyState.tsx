import styled from "@emotion/styled"
import { Plus } from "lucide-react"
import addPerson from "../../assets/icons/add-person.svg"
import { EmptyCardState } from "../shared/EmptyCardState"
import { PrimaryButton } from "../shared/PrimaryButton"
import { CircleHelpButton } from "./CircleHelpButton"

interface AssigneesEmptyStateProps {
	onOpenInfoModal: () => void
	onOpenCreateDialog: () => void
}

export function AssigneesEmptyState({
	onOpenInfoModal,
	onOpenCreateDialog,
}: AssigneesEmptyStateProps) {
	return (
		<EmptyStateCenterContainer>
			<EmptyCardState
				isChildTitleIcon={true}
				imgSrc={addPerson}
				title="טרם הוגדרו אחראים"
				description="לכל אחראי ניתן לכתב מספר משתמשים, אשר 
							יקבלו את ההנחיות לאזור האישי שלהם."
			>
				<CircleHelpButton onClick={onOpenInfoModal} />
			</EmptyCardState>
			<PrimaryButton
				onClick={onOpenCreateDialog}
				height={32}
				title={
					<>
						צור אחראי <Plus size={16} />
					</>
				}
			/>
		</EmptyStateCenterContainer>
	)
}

const CenterContainer = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
    direction: ltr;
`

const EmptyStateCenterContainer = styled(CenterContainer)`
	height: 70%;
	flex-direction: column;
	gap: 16px;
`
