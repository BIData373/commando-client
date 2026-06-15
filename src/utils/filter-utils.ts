import type { TaskRow } from "./task-table-utils"

export enum QuickFilter {
	OVERDUE = "overdue",
	APPROACHING = "approaching",
	FLAGGED = "flagged",
}

const getDashboardFilterKey = "dashboard-filter"

export const dashboardFilterDataTypeKey = `${getDashboardFilterKey}-type`
export const dashboardFilterRangeKey = `${getDashboardFilterKey}-range`

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
