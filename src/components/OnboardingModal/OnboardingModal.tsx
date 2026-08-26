import styled from "@emotion/styled"
import { useLocalStorage } from "@mantine/hooks"
import { useState } from "react"
import logoWithText from "src/assets/logo-with-text-dark.png"
import { Dialog, DialogContent } from "../ui/dialog"
import { OnboardingGreetingPage } from "./OnboardingGreetingPage"
import { OnboardingRedirectPage } from "./OnboardingRedirectPage"
import { OnboardingSysDescPage } from "./OnboardingSysDescPage"

export function OnboardingModal() {
	const [isOpen, setIsOpen] = useLocalStorage({
		key: "onboardingRequired",
		defaultValue: true,
	})

	const [step, setStep] = useState(0)

	if (step === 3 && isOpen === true) setIsOpen(false)

	const handleStepIncrement = () => {
		setStep((prevStep) => prevStep + 1)
	}

	const handleStepDecrement = () => {
		setStep((prevStep) => prevStep - 1)
	}

	const handleCloseModal = () => {
		setStep(0)
		setIsOpen(false)
	}

	if (!isOpen) return null

	return (
		<Dialog open={!!isOpen}>
			<FullScreenPanel
				backgroundColor="var(--background-area)"
				fullScreen={true}
				overlay={true}
				closable={false}
				showCloseButton={false}
				dir="rtl"
			>
				<Header>
					<Logo src={logoWithText} alt="Vector" />
				</Header>
				{step === 0 && <OnboardingGreetingPage onNext={handleStepIncrement} />}
				{step === 1 && (
					<OnboardingSysDescPage
						onNext={handleStepIncrement}
						onPrevious={handleStepDecrement}
						onSkip={handleCloseModal}
					/>
				)}
				{step === 2 && (
					<OnboardingRedirectPage
						onNext={handleStepIncrement}
						onPrevious={handleStepDecrement}
						onRedirect={handleCloseModal}
					/>
				)}
			</FullScreenPanel>
		</Dialog>
	)
}

const FullScreenPanel = styled(DialogContent)`
	//the svgs have built in shadow that needs accomodating as it takes space
	--accomodation-padding: 6.5vw;

	display: flex;
	flex-direction: column;
	justify-content: space-between;
	gap: 1.5rem;

	width: 100%;
	max-width: 100vw;
	height: 100vh;
	padding: 5vh 0;
	border-radius: 0;
	border: none;

	background: var(--background-area);
	scrollbar-gutter: stable;
`

const Header = styled.header`
	display: flex;
	justify-content: flex-end;

	padding-left: var(--accomodation-padding);
`

const Logo = styled.img`
	height: clamp(50px, 5vh, 70px);
`
