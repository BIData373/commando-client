import { DeadlineType, type TaskRowDto } from "src/api/model"

export const EMPTY_FILTER_VALUE = "__EMPTY__"

export const EMPTY_FILTER_LABEL = "(ריקים)"

export function isEmptyValue(value: string) {
	return value === EMPTY_FILTER_VALUE
}

export function getDeadlineFilterValue(
	task: Pick<TaskRowDto, "deadlineType" | "dueDate">,
): string {
	return !task.deadlineType ||
		(task.deadlineType === DeadlineType.DATE && !task.dueDate)
		? EMPTY_FILTER_VALUE
		: task.deadlineType
}
