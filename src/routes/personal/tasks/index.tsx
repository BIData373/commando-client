import { createFileRoute } from "@tanstack/react-router"
import MobilePersonal from "src/components/Mobile/Personal/MobilePersonal"
import { useIsMobile } from "src/hooks/use-mobile"

export const Route = createFileRoute("/personal/tasks/")({
	component: PersonalTasksIndex,
})

function PersonalTasksIndex() {
	const isMobile = useIsMobile()

	return isMobile ? <MobilePersonal /> : null
}
