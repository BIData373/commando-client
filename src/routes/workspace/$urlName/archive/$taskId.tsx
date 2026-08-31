import { createFileRoute, Outlet } from "@tanstack/react-router"

export const Route = createFileRoute("/workspace/$urlName/archive/$taskId")({
	component: () => <Outlet />,
})
