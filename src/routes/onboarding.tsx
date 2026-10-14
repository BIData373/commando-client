import { readLocalStorageValue } from "@mantine/hooks"
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router"
import {
	ONBOARDING_REQUIRED_KEY,
	OnboardingModal,
} from "src/components/OnboardingModal/OnboardingModal"
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
	beforeLoad: () => {
		const needsOnboarding = readLocalStorageValue({
			key: ONBOARDING_REQUIRED_KEY,
			defaultValue: true,
		})
		if (!needsOnboarding) {
			throw redirect({
				to: "/",
			})
		}
	},
})

function Onboarding() {
	return (
		<>
			<OnboardingModal />
			<Outlet />
		</>
	)
}
