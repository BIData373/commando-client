import styled from "@emotion/styled"
import { CircleHelp } from "lucide-react"

interface CircleHelpButtonProps {
	onClick?: () => void
}

export function CircleHelpButton({ onClick }: CircleHelpButtonProps) {
	return (
		<StyledCircleHelpButton onClick={onClick}>
			<CircleHelp size={16} />
		</StyledCircleHelpButton>
	)
}

const StyledCircleHelpButton = styled.span`
	display: flex;
	justify-content: center;
	align-items: center;
	background: white;
	border-radius: 50%;
	height: 24px;
	width: 24px;
	cursor: pointer;
	box-shadow: var(--shadow-md);
	transition: box-shadow 200ms;

	&:hover {
		box-shadow: var(--shadow-2xl);
	}
`
