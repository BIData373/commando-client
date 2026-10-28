import { useListPersonalTaskRows } from "src/api/task/task"
import { countTasksByStatusType } from "src/functions/status-counts"
import MobileTasksPage from "../MobileTasksPage"
import MobileTaskCard from "../Workspace/MobileTaskCard"

export default function MobilePersonal() {
	const { data: tasks = [], isLoading } = useListPersonalTaskRows({
		isArchived: false,
	})

	return (
		<MobileTasksPage
			title="אזור אישי - הנחיות שקיבלתי"
			tasks={tasks}
			isLoading={isLoading}
			statusSegments={countTasksByStatusType(tasks)}
			renderCard={(task) => <MobileTaskCard type="personal" task={task} />}
		/>
	)
}
