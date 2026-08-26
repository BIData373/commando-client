import styled from "@emotion/styled"
import { PrimaryButton } from "../shared/PrimaryButton"
import { ButtonGroup as ButtonGroupPrimitive } from "./shared/ButtonGroup"
import { GhostButton } from "./shared/GhostButton"

interface OnboardingGreetingPageProps {
	onNext: () => void
	onPrevious: () => void
	onSkip: () => void
}

export function OnboardingSysDescPage({
	onNext,
	onPrevious,
	onSkip,
}: OnboardingGreetingPageProps) {
	return (
		<>
			<Main src="../../public/systemDesc.svg"></Main>
			<Footer>
				<SkipBtn onClick={onSkip}>דלג</SkipBtn>
				<ButtonGroup>
					<GhostButton onClick={onPrevious}>חזור</GhostButton>
					<PrimaryBtn onClick={onNext} title="המשך"></PrimaryBtn>
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
    display: flex;
    align-items: center;
    justify-content: space-between;

    padding: 0 var(--accomodation-padding);
`

const PrimaryBtn = styled(PrimaryButton)`
    padding: 0.5rem 1rem;

    font-size: var(--fs-base);
`

const SkipBtn = styled.button`
    display: flex;
    align-items: center;

    padding: 0.5rem 1rem;
    border-radius: 8px;
    border: var(--card-border) 1px solid;

    line-height: 24px;
    font-size: var(--fs-base);
    color:var(--text-color-2);
    background-color: var(--background);
    cursor: pointer;
`

const ButtonGroup = styled(ButtonGroupPrimitive)`
    margin-bottom: -2px;
`
