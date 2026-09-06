import { createRouter } from "@tanstack/react-router"
import { queryClient } from "./queryClient"
import { routeTree } from "./routeTree.gen"

const router = createRouter({
	routeTree,
	context: { queryClient },
	notFoundMode: "root",
	scrollRestoration: true,
	defaultPreload: "intent",
	defaultPreloadStaleTime: 0,
	defaultViewTransition: true,
})

const onboardingStatus = localStorage.getItem("onboardingRequired")
const needsOnboarding =
	onboardingStatus === null ? true : JSON.parse(onboardingStatus)

export let unsubscribeFromOnboarding: () => void

if (needsOnboarding) {
	unsubscribeFromOnboarding = router.subscribe("onBeforeNavigate", (event) => {
		const isAlreadyOnboarding = event.toLocation.pathname === "/onboarding"

		if (needsOnboarding && !isAlreadyOnboarding) {
			router.navigate({
				to: "/onboarding",
				replace: true,
			})
		}
	})
}

declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router
	}
}

export default router
