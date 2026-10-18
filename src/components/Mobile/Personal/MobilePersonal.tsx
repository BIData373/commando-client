import { useListPersonalTaskRows } from "src/api/task/task"
import { countTasksByStatusType } from "src/functions/status-counts"
import { useOpenTask } from "src/hooks/useOpenTask"
import MobileTasksPage from "../MobileTasksPage"
import MobileTaskCard from "../Workspace/MobileTaskCard"

export default function MobilePersonal() {
	const { openTask } = useOpenTask("/personal/tasks/$taskId")

	const { data: tasks = [], isLoading } = useListPersonalTaskRows({
		isArchived: false,
	})

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
					onClick={() => openTask(task.id)}
				/>
			)}
		/>
	)
}
