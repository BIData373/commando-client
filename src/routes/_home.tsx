import { createFileRoute, Outlet } from "@tanstack/react-router"
import HomePage from "src/components/HomePage/HomePage"
import MobileHomePage from "src/components/‏‏Mobile/MobileHomePage/MobileHomePage"
import { useIsMobile } from "src/hooks/use-mobile"

export const Route = createFileRoute("/_home")({
	component: HomeLayout,
})

function HomeLayout() {
	const isMobile = useIsMobile()

	return (
		<>
			{isMobile ? <MobileHomePage /> : <HomePage />}
			<Outlet />
		</>
	)
}
