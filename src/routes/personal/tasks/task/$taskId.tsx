import { createFileRoute, Outlet } from "@tanstack/react-router"

export const Route = createFileRoute("/personal/tasks/task/$taskId")({
	component: () => <Outlet />,
})
