import { createFileRoute, Outlet } from "@tanstack/react-router"
import Header from "src/components/Header"
import { ContentScrollArea } from "src/components/shared/ContentScrollArea"
import { PageShell } from "src/components/shared/PageShell"

export const Route = createFileRoute("/personal")({
	component: PersonalPage,
})

function PersonalPage() {
	return (
		<PageShell>
			<Header variant="personal" />
			<ContentScrollArea>
				<Outlet />
			</ContentScrollArea>
		</PageShell>
	)
}
