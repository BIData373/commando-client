import type { DateRange } from "react-day-picker"
import type { TaskDto } from "src/api/model"

export enum DATE_TYPE {
	CREATION_DATE = "תאריך יצירה",
	EXPECTED_END = 'לפי תג"ב',
	ISSUE_DATE = "תאריך מתן הנחייה",
	UPDATED_DATE = "תאריך עדכון",
}

export function getTaskDateByDateType<TTask extends TaskDto>(
	task: TTask,
	type: DATE_TYPE,
): Date | null {
	switch (type) {
		case DATE_TYPE.CREATION_DATE:
			return task.createdAt
		case DATE_TYPE.EXPECTED_END:
			return task.dueDate ?? null
		case DATE_TYPE.ISSUE_DATE:
			return task.source?.date ?? null
		case DATE_TYPE.UPDATED_DATE:
			return task.updatedAt
		default:
			return task.createdAt
	}
}
export type DatePickerValue = Date | DateRange
