import { createFileRoute, Outlet } from "@tanstack/react-router"
import HomePage from "src/components/HomePage/HomePage"

export const Route = createFileRoute("/_home")({
	component: HomeLayout,
})

function HomeLayout() {
	return (
		<>
			<HomePage />
			<Outlet />
		</>
	)
}
