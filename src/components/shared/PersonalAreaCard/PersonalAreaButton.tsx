import styled from "@emotion/styled"
import { ArrowLeft } from "lucide-react"
import { MOBILE_MEDIA_QUERY } from "src/hooks/use-mobile"
import { PrimaryButton } from "../PrimaryButton"

interface PersonalAreaButtonProps {
	onClick?(): void
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

    ${MOBILE_MEDIA_QUERY} {
    	font-size: 16px;
    	line-height: 24px;
    }
`
