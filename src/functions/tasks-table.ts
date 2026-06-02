import type { TaskDto } from "src/api/model"
import {
	formatTaskRowId,
	type TaskRow,
} from "src/providers/TasksFiltersProvider"

export function toTaskRows(tasks: TaskDto[]): TaskRow[] {
	return tasks.flatMap(({ id, assigneeStatuses, ...task }) =>
		assigneeStatuses.map(({ assignee, status }) => ({
			...task,
			id,
			assigneeStatuses,
			rowKey: formatTaskRowId(id, assignee.id),
			assignee,
			status,
			otherAssignees: assigneeStatuses.filter(
				(as) => as.assignee.id !== assignee.id,
			),
		})),
	)
}
