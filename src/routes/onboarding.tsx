import { createFileRoute, Outlet } from "@tanstack/react-router"
import { OnboardingModal } from "src/components/OnboardingModal/OnboardingModal"
import { z } from "zod"

export enum OnboardingSteps {
	Greeting = "greeting",
	SystemDescription = "system-description",
	Redirects = "redirects",
}

const OnboardingStepSchema = z.object({
	step: z.enum(OnboardingSteps).default(OnboardingSteps.Greeting),
})

export const Route = createFileRoute("/onboarding")({
	component: Onboarding,
	validateSearch: OnboardingStepSchema,
})

function Onboarding() {
	return (
		<>
			<OnboardingModal />
			<Outlet />
		</>
	)
}
