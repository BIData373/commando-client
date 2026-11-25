import { createFileRoute, redirect } from "@tanstack/react-router"

// TODO: Temporary redirect from the legacy /personal/task/ URL — remove once old links are no longer in use
export const Route = createFileRoute("/personal/task/$taskId/")({
	beforeLoad: ({ params }) => {
		throw redirect({
			to: "/personal/tasks/$taskId",
			params,
			replace: true,
		})
	},
})
