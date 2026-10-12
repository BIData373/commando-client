import { useNavigate } from "@tanstack/react-router"
import type { TaskRowWithWorkspaceDto } from "src/api/model"
import { useListPersonalTaskRows } from "src/api/task/task"
import { TasksView } from "src/routes/workspace/$urlName/tasks"
import MobileStatusBar from "../shared/MobileStatusBar"
import MobileTasksLayout from "../shared/MobileTasksLayout"
import MobileTaskCard from "../Workspace/MobileTaskCard"

export default function MobilePersonal() {
	const navigate = useNavigate()

	const { data: tasks = [], isLoading } = useListPersonalTaskRows()

	function handleOpenTask(task: TaskRowWithWorkspaceDto) {
		navigate({
			to: "/personal/tasks/$taskId",
			params: { taskId: String(task.id) },
			search: { view: TasksView.TABLE },
		})
	}

	return (
		<MobileTasksLayout
			headerIcon={null}
			headerTitle="אזור אישי - הנחיות שקיבלתי"
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
					workspaceName={task.workspace?.title}
				/>
			)}
		/>
	)
}
