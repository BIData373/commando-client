import { createFileRoute, Outlet } from "@tanstack/react-router"

export const Route = createFileRoute("/personal")({
	component: () => <Outlet />,
	staticData: {
		header: {
			headerTitle: "אזור אישי",
			user: true,
		},
	},
})
