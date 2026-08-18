import type { TaskRowDto } from "src/api/model"

export function matchesAssigneeFilter(task: TaskRowDto, assigneeIds: number[]) {
	if (assigneeIds.length === 0) return true

	const taskAssigneeIds = [
		task.assignee?.id,
		...task.otherAssignees.map((a) => a.assignee.id),
	]

	return assigneeIds.some((id) => taskAssigneeIds.includes(id))
}
