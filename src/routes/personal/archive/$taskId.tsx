import { createFileRoute, Outlet } from "@tanstack/react-router"

export const Route = createFileRoute("/personal/archive/$taskId")({
	component: () => <Outlet />,
})
