import { useNavigate } from "@tanstack/react-router"
import type { TaskRowWithWorkspaceDto } from "src/api/model"
import { useListPersonalTaskRows } from "src/api/task/task"
import { countTasksByStatusType } from "src/functions/status-counts"
import { TasksView } from "src/routes/workspace/$urlName/tasks"
import MobileTasksPage from "../MobileTasksPage"
import MobileTaskCard from "../Workspace/MobileTaskCard"

export default function MobilePersonal() {
	const navigate = useNavigate()

	const { data: tasks = [], isLoading } = useListPersonalTaskRows({
		isArchived: false,
	})

	function handleOpenTask(task: TaskRowWithWorkspaceDto) {
		navigate({
			to: "/personal/tasks/$taskId",
			params: { taskId: String(task.id) },
			search: { view: TasksView.TABLE },
		})
	}

	return (
		<MobileTasksPage
			title="אזור אישי - הנחיות שקיבלתי"
			tasks={tasks}
			isLoading={isLoading}
			statusSegments={countTasksByStatusType(tasks)}
			renderCard={(task, searchQuery) => (
				<MobileTaskCard
					key={task.rowKey}
					task={task}
					searchQuery={searchQuery}
					workspaceTitle={task.workspace?.title}
					onClick={() => handleOpenTask(task)}
				/>
			)}
		/>
	)
}
