import { useListTaskRows } from "src/api/task/task"
import { countTasksByStatus } from "src/functions/status-counts"
import { useOpenTask } from "src/hooks/useOpenTask"
import { useWorkspace } from "src/providers/WorkspaceProvider"
import MobileTasksPage from "../MobileTasksPage"
import MobileTaskCard from "./MobileTaskCard"

export default function MobileWorkspace() {
	const {
		workspace: { id: workspaceId, icon, title },
		statuses,
	} = useWorkspace()
	const { openTask } = useOpenTask("/workspace/$urlName/tasks/$taskId")

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
			renderCard={(task, searchQuery) => (
				<MobileTaskCard
					key={task.rowKey}
					task={task}
					searchQuery={searchQuery}
					onClick={() => openTask(task.id)}
				/>
			)}
		/>
	)
}
