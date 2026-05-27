import { createFileRoute } from "@tanstack/react-router";
import { QuickFilter } from "src/utils/filterUtils";
import { DirectiveStatus } from "src/utils/statusUtils";
import { DeadlineType } from "../../../components/shared/DeadlineTag";
import TasksLayout, { type View } from "../../../components/Tasks/TasksLayout";
import { TasksProvider } from "../../../providers/TasksProvider";

export const Route = createFileRoute("/workspace/$urlName/tasks")({
	component: TasksPage,
	validateSearch: (
		search: Record<string, unknown>,
	): {
		view: View;
		tabFilter?: QuickFilter;
		statusFilter?: DirectiveStatus;
		deadlineTypeFilter?: DeadlineType;
	} => ({
		view: search.view === "CARDS" ? "CARDS" : "TABLE",
		tabFilter: Object.values(QuickFilter).find((v) => v === search.tabFilter),
		statusFilter: Object.values(DirectiveStatus).find(
			(v) => v === search.statusFilter,
		),
		deadlineTypeFilter: Object.values(DeadlineType).find(
			(v) => v === search.deadlineTypeFilter,
		),
	}),
	staticData: {
		header: {
			title: "הנחיות",
			user: true,
			navigation: true,
			workspace: true,
		},
	},
});

function TasksPage() {
	const { view, tabFilter, statusFilter, deadlineTypeFilter } = Route.useSearch();
	const { urlName } = Route.useParams();

	return (
		<TasksProvider>
			<TasksLayout
				view={view}
				urlName={urlName}
				tabFilter={tabFilter}
				statusFilter={statusFilter}
				deadlineTypeFilter={deadlineTypeFilter}
			/>
		</TasksProvider>
	);
}
