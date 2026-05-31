import {
	createFileRoute,
	useNavigate,
	useSearch,
} from "@tanstack/react-router";
import { useGetTask } from "src/api/task/task";
import { WorkspaceProvider } from "src/providers/WorkspaceProvider";
import TaskDetailPanel from "../../../../components/TaskDetail/TaskDetailPanel";

export const Route = createFileRoute("/workspace/$urlName/tasks/$taskId")({
	component: TaskDetail,
});

function TaskDetail() {
	const { urlName, taskId } = Route.useParams();
	const { view } = useSearch({ from: "/workspace/$urlName/tasks" });
	const navigate = useNavigate();

	const { data: task } = useGetTask({ id: Number(taskId) });

	function handleClose() {
		navigate({
			to: "/workspace/$urlName/tasks",
			params: { urlName },
			search: { view },
		});
	}

	function handleArchive() {
		// if (task) {
		// 	removeTasks([task.id]);
		// }
		handleClose();
	}

	function handleDelete() {
		// if (task) {
		// 	removeTasks([task.id]);
		// }
		handleClose();
	}

	return (
		!!task && (
			<WorkspaceProvider>
				<TaskDetailPanel
					task={task}
					onClose={handleClose}
					onArchive={handleArchive}
					onDelete={handleDelete}
				/>
			</WorkspaceProvider>
		)
	);
}
