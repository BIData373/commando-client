import type { AssigneeStatusDto, TaskDto } from "src/api/model"
import {
	formatTaskRowId,
	type TaskRow,
} from "src/providers/TasksFiltersProvider"

function formatTaskRow(
	{ id, assigneeStatuses, ...task }: TaskDto,
	assigneeStatus?: AssigneeStatusDto,
): TaskRow {
	const { assignee, status, description } = assigneeStatus ?? {}
	return {
		...task,
		id,
		assigneeStatuses,
		rowKey: formatTaskRowId(id, assignee?.id),
		status,
		assignee,
		description: assigneeStatuses.length > 1 ? (description || null) : null,
		...(assignee && {
			otherAssignees: assigneeStatuses.filter(
				(as) => as.assignee.id !== assignee.id,
			),
		}),
	}
}

export function toTaskRows(tasks: TaskDto[]): TaskRow[] {
	return tasks.flatMap((task) =>
		task.assigneeStatuses.length > 0
			? task.assigneeStatuses.map((as) => formatTaskRow(task, as))
			: [formatTaskRow(task)],
	)
}
