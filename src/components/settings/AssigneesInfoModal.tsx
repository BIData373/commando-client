import styled from "@emotion/styled"
import assigneesInformational from "../../assets/assignees-informational.svg"
import { ModalCloseButton } from "../shared/ModalCloseButton"
import { ModalContent } from "../shared/ModalContent"
import { PrimaryButton } from "../shared/PrimaryButton"
import { Dialog, DialogClose } from "../ui/dialog"

export function AssigneesInfoModal({
	...props
}: React.ComponentProps<typeof Dialog>) {
	return (
		<Dialog {...props}>
			<StyledModalContent headerPadding={0} showCloseButton={false}>
				<DialogBody>
					<DialogImage src={assigneesInformational} />
					<StyledDialogClose />
				</DialogBody>
				<DialogActions>
					<DialogClose>
						<PrimaryButton title="הבנתי, תודה"></PrimaryButton>
					</DialogClose>
				</DialogActions>
			</StyledModalContent>
		</Dialog>
	)
}

const StyledModalContent = styled(ModalContent)`
    display: flex;
    flex-direction: column;
    gap: 16px;
    width: 1300px;
    height: 600px;
	max-width: calc(100vw - 2rem);
	max-height: calc(100vh - 4rem);
    padding: 32px 48px;
`

const DialogBody = styled.div`
    flex: 1; 
`

const DialogImage = styled.img`
    width: 100%;
    height: 100%;
`

const DialogActions = styled.div`
    display: flex;
    justify-content: flex-end;
    align-items: center;
`

const StyledDialogClose = styled(ModalCloseButton)`
    position: absolute;
    top: 24px;
    left: 38px;
`
