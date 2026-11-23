import styled from "@emotion/styled"
import { Link } from "@tanstack/react-router"
import { TEST_IDS } from "src/consts/test-ids"
import systemDescription from "../../assets/system-description.svg"
import { GradientGhostButton } from "../shared/GradientGhostButton"
import { PrimaryButton } from "../shared/PrimaryButton"
import { ButtonGroup as ButtonGroupPrimitive } from "../ui/button-group"

interface OnboardingSysDescPageProps {
	onNext: () => void
	onPrevious: () => void
	onSkip: () => void
}

export function OnboardingSysDescPage({
	onNext,
	onPrevious,
	onSkip,
}: OnboardingSysDescPageProps) {
	return (
		<>
			<Main src={systemDescription}></Main>
			<Footer>
				<Link to="/">
					<SkipBtn data-testid={TEST_IDS.onboarding.skip} onClick={onSkip}>
						דלג
					</SkipBtn>
				</Link>
				<ButtonGroup>
					<GradientGhostButton
						testId={TEST_IDS.onboarding.previous}
						onClick={onPrevious}
					>
						חזור
					</GradientGhostButton>
					<PrimaryBtn
						data-testid={TEST_IDS.onboarding.next}
						onClick={onNext}
						title="המשך"
					></PrimaryBtn>
				</ButtonGroup>
			</Footer>
		</>
	)
}

const Main = styled.img`
    flex: 1;

    padding: 0 var(--accomodation-padding) 0 4.5vw;
`
const Footer = styled.footer`
    position: sticky;
    bottom: -48vh;

    display: flex;
    align-items: center;
    justify-content: space-between;

    padding: 0 var(--accomodation-padding);
`

const PrimaryBtn = styled(PrimaryButton)`
    padding: 8px 16px;

    font-size: var(--fs-base);
`

const SkipBtn = styled.button`
    display: flex;
    align-items: center;

    padding: 8px 16px;
    border-radius: 8px;
    border: var(--card-border) 1px solid;

    line-height: 24px;
    font-size: var(--fs-base);
    color:var(--text-color-2);
    background-color: var(--background);
    cursor: pointer;
`

const ButtonGroup = styled(ButtonGroupPrimitive)`
    gap: 1rem;
    margin-bottom: -2px;
`
