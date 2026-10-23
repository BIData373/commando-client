import { useListTaskRows } from "src/api/task/task"
import { countTasksByStatus } from "src/functions/status-counts"
import { useWorkspace } from "src/providers/WorkspaceProvider"
import MobileTasksPage from "../MobileTasksPage"
import MobileTaskCard from "./MobileTaskCard"

export default function MobileWorkspace() {
	const {
		workspace: { id: workspaceId, icon, title },
		statuses,
	} = useWorkspace()

	const { data: tasks = [], isLoading } = useListTaskRows({
		workspaceId,
		isArchived: false,
	})

	return (
		<MobileTasksPage
			icon={icon}
			title={title}
			tasks={tasks}
			isLoading={isLoading}
			statusSegments={countTasksByStatus(tasks, statuses)}
			renderCard={(task) => <MobileTaskCard type="workspace" task={task} />}
		/>
	)
}
