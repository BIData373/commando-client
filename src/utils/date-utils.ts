import type { DateRange } from "react-day-picker";

export enum DATE_TYPE {
	CREATION_DATE = "תאריך יצירה",
	EXPECTED_END = 'לפי תג"ב',
	INSTRUCTION_DATE = "תאריך מתן הנחייה",
	UPDATING_DATE = "תאריך עדכון",
}

export type DatePickerValue = Date | DateRange