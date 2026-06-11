import type { TaskRow } from "src/providers/TasksFiltersProvider"

type TaskValueKey = "discussionName" | keyof TaskRow

export function getTaskValue(key: TaskValueKey, task: TaskRow) {
	if (key === "discussionName") {
		return task.source?.name
	}

	switch (key) {
		case "assigneeStatuses":
			return task.assignee?.name
		case "status":
			return task.status?.type
		default:
			return task[key]
	}
}
