import { createFileRoute, Outlet } from "@tanstack/react-router"
import Header from "src/components/Header"
import { ContentScrollArea } from "src/components/shared/ContentScrollArea"
import { PageShell } from "src/components/shared/PageShell"
import { useUserWorkspaceEntrie } from "src/hooks/useUserWorkspaceExit"
import { useRenderInHeader } from "src/providers/HeaderProvider"
import { updateUserEntrie } from "../api/user-workspace-entries/user-workspace-entries"

export const Route = createFileRoute("/personal")({
	component: PersonalPage,
	onLeave: () => updateUserEntrie(),
})

function PersonalPage() {
	useRenderInHeader("center", "אזור אישי - הנחיות שקיבלתי")

	useUserWorkspaceEntrie({})

	return (
		<PageShell>
			<Header />
			<ContentScrollArea>
				<Outlet />
			</ContentScrollArea>
		</PageShell>
	)
}
