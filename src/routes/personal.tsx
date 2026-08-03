import { createFileRoute, Outlet } from "@tanstack/react-router"
import Header from "src/components/Header"
import { useRenderInHeader } from "src/providers/HeaderProvider"

export const Route = createFileRoute("/personal")({
	component: PersonalPage,
})

function PersonalPage() {
	useRenderInHeader("center", "אזור אישי")

	return (
		<>
			<Header />
			<Outlet />
		</>
	)
}
