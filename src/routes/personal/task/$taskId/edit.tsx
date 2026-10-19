import { createFileRoute, redirect } from "@tanstack/react-router"
import { TasksView } from "src/routes/workspace/$urlName/tasks"

// TODO: Temporary redirect from the legacy /personal/task/ URL — remove once old links are no longer in use
export const Route = createFileRoute("/personal/task/$taskId/edit")({
	beforeLoad: ({ params }) => {
		throw redirect({
			to: "/personal/tasks/$taskId/edit",
			params,
			search: { view: TasksView.TABLE },
			replace: true,
		})
	},
})
