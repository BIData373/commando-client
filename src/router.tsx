import { createRouter } from "@tanstack/react-router"
import type { ReactNode } from "react"
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

declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router
	}
}

export function buildAbsoluteUrl(
	options: Parameters<typeof router.buildLocation>[0],
): string {
	const { href } = router.buildLocation(options)
	return `${window.location.origin}${href}`
}

export default router
