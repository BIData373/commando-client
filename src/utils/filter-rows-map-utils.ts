import type { TaskRow } from "src/providers/TasksFiltersProvider"

type FilterTaskRows<TKey = string, TResult = TaskRow[keyof TaskRow]> = {
	getFilterColumnValue(key: TKey, task: TaskRow): TResult
}

function getAssigneValue(key: string, task: TaskRow) {
	if (key === "discussionName") {
		return task.source?.name
	}

	const idKey = key as keyof TaskRow
	switch (idKey) {
		case "assigneeStatuses":
			return task.assignee?.name
		case "status":
			return task.status?.type
		default:
			return task[idKey]
	}
}

export const filterRows: FilterTaskRows = {
	getFilterColumnValue: getAssigneValue,
}
