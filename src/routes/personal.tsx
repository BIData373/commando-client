import { createFileRoute } from "@tanstack/react-router"
import type { TaskColumn } from "src/hooks/useTaskColumns"
import PersonalTasksLayout from "../components/Personal/PersonalTasksLayout"
import type { View } from "../components/Tasks/TasksLayout"
import { TasksFiltersProvider } from "../providers/TasksFiltersProvider"

export const Route = createFileRoute("/personal")({
  component: PersonalPage,
  validateSearch: (search: Record<string, unknown>): { view: View } => ({
    view: search.view === "CARDS" ? "CARDS" : "TABLE",
  }),
  staticData: {
    header: {
      title: "הנחיות שקיבלתי",
      navigation: false,
      user: true,
    },
  },
})

const PERSONAL_DEFAULT_COLUMN_ORDER: TaskColumn[] = [
  "title",
  "status",
  "responsible",
  "deadlineType",
  "discussionName",
  "tags",
  "notes",
  "workspace",
  "createdAt",
  "updatedAt",
] as TaskColumn[]

const PERSONAL_DEFAULT_HIDDEN = new Set<TaskColumn>([
  "tags",
  "notes",
  "updatedAt",
] as TaskColumn[])

function PersonalPage() {
  const { view } = Route.useSearch()

  return (
    <TasksFiltersProvider
      defaultColumnOrder={PERSONAL_DEFAULT_COLUMN_ORDER}
      defaultHiddenColumns={PERSONAL_DEFAULT_HIDDEN}
    >
      <PersonalTasksLayout view={view}/>
    </TasksFiltersProvider>
  )
}
