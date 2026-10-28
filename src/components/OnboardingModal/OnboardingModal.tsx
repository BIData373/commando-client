import styled from "@emotion/styled"
import { useNavigate, useSearch } from "@tanstack/react-router"
import logoWithText from "src/assets/logo-with-text-dark.png"
import { useMarkOnboarded } from "src/hooks/useMarkOnboarded"
import { OnboardingSteps } from "src/routes/onboarding"
import { Dialog, DialogContent } from "../ui/dialog"
import { OnboardingGreetingPage } from "./OnboardingGreetingPage"
import { OnboardingRedirectPage } from "./OnboardingRedirectPage"
import { OnboardingSysDescPage } from "./OnboardingSysDescPage"

export const ONBOARDING_STEP_ORDER: OnboardingSteps[] = [
	OnboardingSteps.Greeting,
	OnboardingSteps.SystemDescription,
	OnboardingSteps.Redirects,
]

export function OnboardingModal() {
	const navigate = useNavigate({ from: "/onboarding" })
	const { step = OnboardingSteps.Greeting } = useSearch({ from: "/onboarding" })
	const markOnboarded = useMarkOnboarded()

	const currentStepIndex = ONBOARDING_STEP_ORDER.indexOf(step)

	const setStep = (step: OnboardingSteps) => {
		navigate({
			search: { step },
		})
	}

	const handleStepIncrement = () => {
		if (currentStepIndex < ONBOARDING_STEP_ORDER.length - 1) {
			setStep(ONBOARDING_STEP_ORDER[currentStepIndex + 1])
		}
	}

	const handleStepDecrement = () => {
		if (currentStepIndex > 0) {
			setStep(ONBOARDING_STEP_ORDER[currentStepIndex - 1])
		}
	}

	function handleFinishOnboarding() {
		markOnboarded()
	}

	function handleSkipOnboarding() {
		markOnboarded()
		navigate({ to: "/" })
	}

	const pages: Record<OnboardingSteps, React.ReactNode> = {
		[OnboardingSteps.Greeting]: (
			<OnboardingGreetingPage onNext={handleStepIncrement} />
		),
		[OnboardingSteps.SystemDescription]: (
			<OnboardingSysDescPage
				onNext={handleStepIncrement}
				onPrevious={handleStepDecrement}
				onSkip={handleSkipOnboarding}
			/>
		),
		[OnboardingSteps.Redirects]: (
			<OnboardingRedirectPage
				onPrevious={handleStepDecrement}
				onRedirect={handleFinishOnboarding}
			/>
		),
	}

	return (
		<Dialog open>
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
	box-sizing: border-box;
	overflow-y: auto;
	overflow-x: hidden;
	
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
	min-height: 100%;
`

const Header = styled.header`
	display: flex;
	justify-content: flex-end;

	padding-left: var(--accomodation-padding);
`

const Logo = styled.img`
	height: clamp(50px, 5vh, 70px);
`
