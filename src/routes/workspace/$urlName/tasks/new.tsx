import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { WorkspaceProvider } from "src/providers/WorkspaceProvider";
import CreateTaskModal from "../../../../components/CreateTasks/CreateTaskModal";
import CreateDiscussionModal from "../../../../components/CreateTasksFromDiscussion/CreateDiscussionModal";
import type { View } from "../../../../components/Tasks/TasksLayout";

type CreateMode = "single" | "discussion";

interface NewTaskSearch {
	view: View;
	mode: CreateMode;
}

export const Route = createFileRoute("/workspace/$urlName/tasks/new")({
	component: NewTask,
	validateSearch: (search: Record<string, unknown>): NewTaskSearch => ({
		view: search.view === "CARDS" ? "CARDS" : "TABLE",
		mode: search.mode === "discussion" ? "discussion" : "single",
	}),
});

function NewTask() {
	const { urlName } = Route.useParams();
	const { view, mode } = Route.useSearch();
	const navigate = useNavigate();

	function handleClose() {
		navigate({
			to: "/workspace/$urlName/tasks",
			params: { urlName },
			search: { view },
		});
	}

	return (
		<WorkspaceProvider>
			{mode === "discussion" ? (
				<CreateDiscussionModal onClose={handleClose} />
			) : (
				<CreateTaskModal onClose={handleClose} />
			)}
		</WorkspaceProvider>
	)
}
