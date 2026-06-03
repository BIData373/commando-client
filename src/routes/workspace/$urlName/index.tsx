import { createFileRoute, redirect } from "@tanstack/react-router"
import { TasksView } from "./tasks"

export const Route = createFileRoute("/workspace/$urlName/")({
	beforeLoad: ({ params }) => {
		throw redirect({
			to: "/workspace/$urlName/tasks",
			params,
			search: {
        view: TasksView.TABLE
			},
		})
	},
})
