import { createFileRoute } from "@tanstack/react-router";
import { QuickFilter } from "src/utils/filterUtils";
import { DirectiveStatus } from "src/utils/statusUtils";
import { DeadlineType } from "../../../components/shared/DeadlineTag";
import TasksLayout, { type View } from "../../../components/Tasks/TasksLayout";
import { TasksProvider } from "../../../providers/TasksProvider";

function parseArrayParam<T>(value: unknown, validValues: readonly T[]): T[] {
	const arr = Array.isArray(value) ? value : value != null ? [value] : [];
	return arr.filter((v): v is T => (validValues as unknown[]).includes(v));
}

export const Route = createFileRoute("/workspace/$urlName/tasks")({
	component: TasksPage,
	validateSearch: (
		search: Record<string, unknown>,
	): {
		view: View;
		tabFilter: QuickFilter[];
		statusFilter: DirectiveStatus[];
		deadlineTypeFilter: DeadlineType[];
	} => ({
		view: search.view === "CARDS" ? "CARDS" : "TABLE",
		tabFilter: parseArrayParam(search.tabFilter, Object.values(QuickFilter)),
		statusFilter: parseArrayParam(search.statusFilter, Object.values(DirectiveStatus)),
		deadlineTypeFilter: parseArrayParam(search.deadlineTypeFilter, Object.values(DeadlineType)),
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
