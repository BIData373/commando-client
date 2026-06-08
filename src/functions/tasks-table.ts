import type { AssigneeDto, TaskDto, WorkspaceStatusDto } from "src/api/model"
import {
	formatTaskRowId,
	type TaskRow,
} from "src/providers/TasksFiltersProvider"

function formatTaskRow(
	{ id, assigneeStatuses, ...task }: TaskDto,
	assignee?: AssigneeDto,
	status?: WorkspaceStatusDto,
): TaskRow {
	return {
		...task,
		id,
		assigneeStatuses,
		rowKey: formatTaskRowId(id, assignee?.id),
		status,
		assignee,
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
			? task.assigneeStatuses.map(({ assignee, status }) =>
					formatTaskRow(task, assignee, status),
				)
			: [formatTaskRow(task)],
	)
}
