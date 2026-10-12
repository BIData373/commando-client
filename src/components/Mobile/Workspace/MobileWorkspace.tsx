import { useNavigate } from "@tanstack/react-router"
import type { TaskRowDto } from "src/api/model"
import { useListTaskRows } from "src/api/task/task"
import { useWorkspace } from "src/providers/WorkspaceProvider"
import MobileStatusBar from "../shared/MobileStatusBar"
import MobileTasksLayout from "../shared/MobileTasksLayout"
import MobileTaskCard from "./MobileTaskCard"

export default function MobileWorkspace() {
	const {
		workspace: { id: workspaceId, icon, title, urlName },
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
		<MobileTasksLayout
			headerIcon={icon}
			headerTitle={title}
			tasks={tasks}
			isLoading={isLoading}
			statusBar={<MobileStatusBar tasks={tasks} />}
			onOpenTask={handleOpenTask}
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
