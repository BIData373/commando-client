import styled from "@emotion/styled"
import { useLocalStorage } from "@mantine/hooks"
import { useNavigate, useSearch } from "@tanstack/react-router"
import logoWithText from "src/assets/logo-with-text-dark.png"
import { OnboardingSteps as Steps } from "src/routes/onboarding"
import { Dialog, DialogContent } from "../ui/dialog"
import { OnboardingGreetingPage } from "./OnboardingGreetingPage"
import { OnboardingRedirectPage } from "./OnboardingRedirectPage"
import { OnboardingSysDescPage } from "./OnboardingSysDescPage"

const STEP_ORDER: Steps[] = [Steps.greeting, Steps.sysDesc, Steps.redirects]

export function OnboardingModal() {
	const navigate = useNavigate({ from: "/onboarding" })
	const { step = Steps.greeting } = useSearch({ from: "/onboarding" })

	const [isOpen, setIsOpen] = useLocalStorage({
		key: "onboardingRequired",
		defaultValue: true,
	})

	const currentStepIndex = STEP_ORDER.indexOf(step)

	const setStep = (newStep: Steps) => {
		navigate({
			search: { step: newStep },
		})
	}

	const handleStepIncrement = () => {
		if (currentStepIndex < 2) {
			setStep(STEP_ORDER[currentStepIndex + 1])
		}
	}

	const handleStepDecrement = () => {
		if (currentStepIndex > 0) {
			setStep(STEP_ORDER[currentStepIndex - 1])
		}
	}

	const handleCloseModal = () => {
		setIsOpen(false)
	}

	const pages: Record<Steps, React.ReactNode> = {
		[Steps.greeting]: <OnboardingGreetingPage onNext={handleStepIncrement} />,
		[Steps.sysDesc]: (
			<OnboardingSysDescPage
				onNext={handleStepIncrement}
				onPrevious={handleStepDecrement}
				onSkip={handleCloseModal}
			/>
		),
		[Steps.redirects]: (
			<OnboardingRedirectPage
				onPrevious={handleStepDecrement}
				onRedirect={handleCloseModal}
			/>
		),
	}

	return (
		<Dialog open={!!isOpen}>
			<FullScreenPanel closable={false} showCloseButton={false}>
				<ContentWrapper>
					<Header>
						<Logo src={logoWithText} alt="Vector" />
					</Header>
					{pages[step]}
				</ContentWrapper>
			</FullScreenPanel>
		</Dialog>
	)
}
const FullScreenPanel = styled(DialogContent)`
	//the svgs have built in shadow that needs accomodating as it takes space
	--accomodation-padding: 6.5vw;

	width: 100vw;
	max-width: 100vw;
	height: 100vh;
	padding: 5vh 0;
	border-radius: 0;
	border: none;

	direction: rtl;
	
	background: var(--background-area);
`

const ContentWrapper = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	gap: 1.5rem;

	position: relative;
	width: 100%;
	height: 100%;
`

const Header = styled.header`
	display: flex;
	justify-content: flex-end;

	padding-left: var(--accomodation-padding);
`

const Logo = styled.img`
	height: clamp(50px, 5vh, 70px);
`
