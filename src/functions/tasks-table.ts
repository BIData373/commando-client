import type { AssigneeDto, TaskDto, WorkspaceStatusDto } from "src/api/model"
import { formatTaskRowId } from "src/providers/TasksFiltersProvider"

function formatTaskRow<TTask extends TaskDto>(
	{ id, assigneeStatuses, ...task }: TTask,
	assignee?: AssigneeDto,
	status?: WorkspaceStatusDto,
) {
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

export function toTaskRows<TTask extends TaskDto>(tasks: TTask[]) {
	return tasks.flatMap((task) =>
		task.assigneeStatuses.length > 0
			? task.assigneeStatuses.map(({ assignee, status }) =>
					formatTaskRow(task, assignee, status),
				)
			: [formatTaskRow(task)],
	)
}
