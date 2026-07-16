import type { DateRange } from "react-day-picker"

export enum DATE_TYPE {
	CREATION_DATE = "תאריך יצירה",
	EXPECTED_END = 'לפי תג"ב',
	ISSUE_DATE = "תאריך מתן הנחיה",
	UPDATED_DATE = "תאריך עדכון",
}

export type DatePickerValue = Date | DateRange
