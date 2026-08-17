import { createFileRoute, Outlet } from "@tanstack/react-router"
import Header from "src/components/Header"
import { ContentScrollArea } from "src/components/shared/ContentScrollArea"
import { PageShell } from "src/components/shared/PageShell"
import { useRenderInHeader } from "src/providers/HeaderProvider"

export const Route = createFileRoute("/personal")({
	component: PersonalPage,
})

function PersonalPage() {
	useRenderInHeader("center", "אזור אישי")

	return (
		<PageShell>
			<Header />
			<ContentScrollArea>
				<Outlet />
			</ContentScrollArea>
		</PageShell>
	)
}
