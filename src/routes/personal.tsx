import { createFileRoute, Outlet } from "@tanstack/react-router"
import Header from "src/components/Header"
import MobilePersonal from "src/components/Mobile/Personal/MobilePersonal"
import { ContentScrollArea } from "src/components/shared/ContentScrollArea"
import { PageShell } from "src/components/shared/PageShell"
import { useIsMobile } from "src/hooks/use-mobile"
import { useRenderInHeader } from "src/providers/HeaderProvider"
import { TasksFiltersProvider } from "src/providers/TasksFiltersProvider"
import { UserViewProvider } from "src/providers/UserViewProvider"

export const Route = createFileRoute("/personal")({
	component: PersonalPage,
})

function PersonalPage() {
	useRenderInHeader("center", "אזור אישי - הנחיות שקיבלתי")
	const isMobile = useIsMobile()

	return isMobile ? (
		<UserViewProvider defaultColumnOrder={[]} defaultHiddenColumns={new Set()}>
			<TasksFiltersProvider>
				<MobilePersonal />
			</TasksFiltersProvider>
		</UserViewProvider>
	) : (
		<PageShell>
			<Header variant="personal" />
			<ContentScrollArea>
				<Outlet />
			</ContentScrollArea>
		</PageShell>
	)
}
