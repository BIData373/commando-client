import { createFileRoute, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/workspace/$urlName/")({
	beforeLoad: ({ params }) => {
		throw redirect({
			to: "/workspace/$urlName/dashboard",
			params,
		})
	},
})
