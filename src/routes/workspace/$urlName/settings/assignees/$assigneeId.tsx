import { createFileRoute, Outlet } from "@tanstack/react-router"

export const Route = createFileRoute(
	"/workspace/$urlName/settings/assignees/$assigneeId",
)({
	component: () => <Outlet />,
})
