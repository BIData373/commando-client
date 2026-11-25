import { createFileRoute, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/personal/")({
	beforeLoad: () => {
		throw redirect({ to: "/personal/tasks" })
	},
})
