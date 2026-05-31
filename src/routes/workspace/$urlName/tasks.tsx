import { createFileRoute } from "@tanstack/react-router";
import { QuickFilter } from "src/utils/filterUtils";
import { DirectiveStatus } from "src/utils/statusUtils";
import { z } from "zod";
import { DeadlineType } from "../../../components/shared/DeadlineTag";
import TasksLayout from "../../../components/Tasks/TasksLayout";
import { TasksProvider } from "../../../providers/TasksProvider";

const queryArray = <T extends z.ZodTypeAny>(schema: T) =>
	z.preprocess(
		(v) => (Array.isArray(v) ? v : v == null ? [] : [v]),
		z.array(schema),
	);

const searchSchema = z.object({
	view: z.enum(["CARDS", "TABLE"]).default("TABLE"),
	tabFilter: queryArray(z.nativeEnum(QuickFilter)).default([]),
	statusFilter: queryArray(z.nativeEnum(DirectiveStatus)).default([]),
	deadlineTypeFilter: queryArray(z.nativeEnum(DeadlineType)).default([]),
});

export type searchSchemaType = z.infer<typeof searchSchema>;


export const Route = createFileRoute("/workspace/$urlName/tasks")({
	component: TasksPage,
	validateSearch: searchSchema,
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
	const { view, tabFilter, statusFilter, deadlineTypeFilter } =
		Route.useSearch();
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
