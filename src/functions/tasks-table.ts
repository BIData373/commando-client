import type { AssigneeStatusDto, TaskDto } from "src/api/model"
import type { TaskRow } from "src/providers/TasksFiltersProvider"
import { formatTaskRowId } from "src/providers/TasksFiltersProvider"

function formatTaskRow(
	task: TaskDto,
	assigneeStatus?: AssigneeStatusDto,
): TaskRow {
	const { id, assigneeStatuses } = task

	return {
		...task,
		rowKey: formatTaskRowId(id, assigneeStatus?.assignee?.id),
		...assigneeStatus,
		...(assigneeStatus?.assignee && {
			otherAssignees: assigneeStatuses.filter(
				(as) => as.assignee.id !== assigneeStatus.assignee.id,
			),
		}),
	}
}

export function toTaskRows(tasks: TaskDto[]): TaskRow[] {
	return tasks.flatMap((task) =>
		task.assigneeStatuses.length > 0
			? task.assigneeStatuses.map((assigneeStatus) =>
					formatTaskRow(task, assigneeStatus),
				)
			: [formatTaskRow(task)],
	)
}
