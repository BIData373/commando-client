import { createFileRoute } from "@tanstack/react-router"
import { DeadlineType, WorkspaceStatusType } from "src/api/model"
import { QuickFilter } from "src/utils/filter-utils"
import { z } from "zod"
import TasksLayout from "../../../components/Tasks/TasksLayout"
import { TasksFiltersProvider } from "../../../providers/TasksFiltersProvider"

export enum TasksView {
  CARDS = 'CARDS',
  TABLE = 'TABLE'
}

const queryArray = <T extends z.ZodTypeAny>(schema: T) =>
  z.preprocess(
    (v) => (Array.isArray(v) ? v : v == null ? [] : [v]),
    z.array(schema),
  );

const TasksSearchSchema = z.object({
  view: z.nativeEnum(TasksView).default(TasksView.TABLE),
  tabFilter: queryArray(z.nativeEnum(QuickFilter)).default([]),
  statusFilter: queryArray(z.nativeEnum(WorkspaceStatusType)).default([]),
  deadlineTypeFilter: queryArray(z.nativeEnum(DeadlineType)).default([]),
});

export type TasksSearchSchemaType = z.infer<typeof TasksSearchSchema>;

export const Route = createFileRoute("/workspace/$urlName/tasks")({
  component: TasksPage,
  validateSearch: TasksSearchSchema,
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
  const { urlName } = Route.useParams()

  return (
    <TasksFiltersProvider>
      <TasksLayout
        view={view}
        urlName={urlName}
        tabFilter={tabFilter}
        statusFilter={statusFilter}
        deadlineTypeFilter={deadlineTypeFilter}
      />
    </TasksFiltersProvider>
  )
}
