import styled from "@emotion/styled"
import { ArrowLeft } from "lucide-react"
import { PrimaryButton } from "../PrimaryButton"

type PersonalAreaButtonProps = {
	onClick?: () => void
}

export default function PersonalAreaButton({
	onClick,
}: PersonalAreaButtonProps) {
	return (
		<StyledPrimaryButton
			title={
				<>
					כניסה לאזור האישי
					<ArrowLeft size={18} />
				</>
			}
			onClick={onClick}
		/>
	)
}

const StyledPrimaryButton = styled(PrimaryButton)`
    font-size: var(--fs-btn);
`
