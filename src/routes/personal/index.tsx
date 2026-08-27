import { createFileRoute, redirect } from "@tanstack/react-router"
import { TasksView } from "../workspace/$urlName/tasks"

export const Route = createFileRoute("/personal/")({
	beforeLoad: () => {
		throw redirect({ to: "/personal/tasks", search: { view: TasksView.TABLE } })
	},
})
