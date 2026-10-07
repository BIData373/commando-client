import { createFileRoute, Outlet } from "@tanstack/react-router"
import Header from "src/components/Header"
import { ContentScrollArea } from "src/components/shared/ContentScrollArea"
import { PageShell } from "src/components/shared/PageShell"
import { MobileViewTaskDetail } from "src/components/‏‏Mobile/task/MobileViewTaskDetail"
import { useIsMobile } from "src/hooks/use-mobile"
import { useTaskDetail } from "src/hooks/useTaskDetail"
import { useRenderInHeader } from "src/providers/HeaderProvider"

export const Route = createFileRoute("/personal")({
	component: PersonalPage,
})

function PersonalPage() {
	const isMobile = useIsMobile()
	useRenderInHeader("center", "אזור אישי - הנחיות שקיבלתי")
	const { task } = useTaskDetail("274")

	//temp
	return isMobile ? (
		<MobileViewTaskDetail task={task} />
	) : (
		<PageShell>
			<Header variant="personal" />
			<ContentScrollArea>
				<Outlet />
			</ContentScrollArea>
		</PageShell>
	)
}
