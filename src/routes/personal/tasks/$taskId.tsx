import { createFileRoute, Outlet } from "@tanstack/react-router"

export const Route = createFileRoute("/personal/tasks/$taskId")({
	component: () => <Outlet />,
})
