import { format } from "date-fns"

export const formatDateToDateMonthYear = (date: Date) =>
	format(date, "dd/MM/yy")
export const formatDateToDateMonthFullYear = (date: Date) =>
	format(date, "dd/MM/yyyy")
export const formatDateToMinutesHours = (date: Date) => format(date, "HH:mm")
