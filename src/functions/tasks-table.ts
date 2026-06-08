import type { AssigneeStatusDto, TaskDto } from "src/api/model"
import { formatTaskRowId } from "src/providers/TasksFiltersProvider"

function formatTaskRow<TTask extends TaskDto>(
	{ id, assigneeStatuses, ...task }: TTask,
	assigneeStatus?: AssigneeStatusDto,
) {
	return {
		...task,
		id,
		assigneeStatuses,
		rowKey: formatTaskRowId(id, assigneeStatus?.assignee?.id),
		...assigneeStatus,
		...(assigneeStatus?.assignee && {
			otherAssignees: assigneeStatuses.filter(
				(as) => as.assignee.id !== assigneeStatus?.assignee.id,
			),
		}),
	}
}

export function toTaskRows<TTask extends TaskDto>(tasks: TTask[]) {
	return tasks.flatMap((task) =>
		task.assigneeStatuses.length > 0
			? task.assigneeStatuses.map((assigneeStatus) =>
					formatTaskRow(task, assigneeStatus),
				)
			: [formatTaskRow(task)],
	)
}
