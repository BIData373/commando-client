import { createFileRoute, Outlet } from "@tanstack/react-router"
import { OnboardingModal } from "src/components/OnboardingModal/OnboardingModal"

export enum OnboardingSteps {
	greeting = "greeting",
	sysDesc = "system-description",
	redirects = "redirects",
}

interface OnboardingSearch {
	step?: OnboardingSteps
}

export const Route = createFileRoute("/onboarding")({
	validateSearch: (search: Record<string, unknown>): OnboardingSearch => {
		const step = search.step as OnboardingSteps

		return {
			step: Object.values(OnboardingSteps).includes(step)
				? step
				: OnboardingSteps.greeting,
		}
	},
	component: Onboarding,
})

function Onboarding() {
	return (
		<>
			<OnboardingModal />
			<Outlet />
		</>
	)
}
