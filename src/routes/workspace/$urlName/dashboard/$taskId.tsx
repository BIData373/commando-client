import { createFileRoute, Outlet } from "@tanstack/react-router"

export const Route = createFileRoute("/workspace/$urlName/dashboard/$taskId")({
	component: () => <Outlet />,
})
