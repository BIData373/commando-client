import { createFileRoute, Outlet } from "@tanstack/react-router"

export const Route = createFileRoute("/personal/archive/task/$taskId")({
	component: () => <Outlet />,
})
