import { createFileRoute, Outlet } from "@tanstack/react-router"

export const Route = createFileRoute("/personal/task/$taskId")({
	component: () => <Outlet />,
})
