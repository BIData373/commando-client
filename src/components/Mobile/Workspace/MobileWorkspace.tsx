import { useNavigate } from "@tanstack/react-router"
import type { TaskRowDto } from "src/api/model"
import { useListTaskRows } from "src/api/task/task"
import { countTasksByStatus } from "src/functions/status-counts"
import { useWorkspace } from "src/providers/WorkspaceProvider"
import MobileTasksPage from "../MobileTasksPage"
import MobileTaskCard from "./MobileTaskCard"

export default function MobileWorkspace() {
	const {
		workspace: { id: workspaceId, icon, title, urlName },
		statuses,
	} = useWorkspace()
	const navigate = useNavigate()

	const { data: tasks = [], isLoading } = useListTaskRows({
		workspaceId,
		isArchived: false,
	})

	function handleOpenTask(task: TaskRowDto) {
		navigate({
			to: "/workspace/$urlName/tasks/$taskId",
			params: { urlName, taskId: String(task.id) },
		})
	}

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
					onClick={() => handleOpenTask(task)}
				/>
			)}
		/>
	)
}
