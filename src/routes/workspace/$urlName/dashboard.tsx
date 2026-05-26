import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/workspace/$urlName/dashboard")({
	component: Dashboard,
	staticData: {
		header: {
			title: "מסך מפקד",
			user: true,
			navigation: true,
			workspace: true,
		},
	},
})

function Dashboard() {
	return <div>Dashboard</div>
}
