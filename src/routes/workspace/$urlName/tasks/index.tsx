import { createFileRoute } from "@tanstack/react-router"
import MobileWorkspace from "src/components/Mobile/Workspace/MobileWorkspace"
import { useIsMobile } from "src/hooks/use-mobile"

export const Route = createFileRoute("/workspace/$urlName/tasks/")({
	component: TasksIndex,
})

function TasksIndex() {
	const isMobile = useIsMobile()

	return isMobile ? <MobileWorkspace /> : null
}
