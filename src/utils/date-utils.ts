import type { DateRange } from "react-day-picker"
import type { TaskRow } from "src/providers/TasksFiltersProvider"

export enum DATE_TYPE {
	CREATION_DATE = "תאריך יצירה",
	EXPECTED_END = 'לפי תג"ב',
	INSTRUCTION_DATE = "תאריך מתן הנחייה",
	UPDATING_DATE = "תאריך עדכון",
}


export function getTaskDateByDateType(task: TaskRow, type: DATE_TYPE): Date | null {
	switch (type) {
		case DATE_TYPE.CREATION_DATE: return task.createdAt
		case DATE_TYPE.EXPECTED_END: return task.dueDate ?? null
		case DATE_TYPE.INSTRUCTION_DATE: return task.source?.date ?? null
		case DATE_TYPE.UPDATING_DATE: return task.updatedAt
		default: return task.createdAt
	}
}
export type DatePickerValue = Date | DateRange
