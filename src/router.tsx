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

export interface HeaderConfig {
	pageTitle?: ReactNode
	headerTitle?: ReactNode
	user?: boolean
	hidden?: boolean
}

declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router
	}

	interface StaticDataRouteOption {
		header?: HeaderConfig
	}
}

export default router
