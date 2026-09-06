import { readLocalStorageValue } from "@mantine/hooks"
import { useEffect } from "react"
import router from "src/router"

export function OnboardingGuard() {
	useEffect(() => {
		const checkOnRedirect = (targetPath: string) => {
			const needsOnboarding =
				readLocalStorageValue({ key: "onboardingRequired" }) ?? true
			const isAlreadyOnboarding = targetPath === "/onboarding"
			if (needsOnboarding && !isAlreadyOnboarding) {
				router.navigate({
					to: "/onboarding",
					replace: true,
				})
			}
		}
		//for redirecting even when "onBeforeNavigate" doesnt fire (homepage)
		checkOnRedirect(window.location.pathname)
		const unsubscribeFromOnboarding = router.subscribe(
			"onBeforeNavigate",
			(event) => {
				checkOnRedirect(event.toLocation.pathname)
			},
		)
		return unsubscribeFromOnboarding
	}, [])

	return null
}
