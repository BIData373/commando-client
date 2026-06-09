import { format } from "date-fns"

const formatDate = (formatStr: string) => (date: Date) =>
	format(date, formatStr)

export const formatDay = formatDate("dd")
export const formatDateMonthYear = formatDate("dd/MM/yy")
export const formatDateMonthFullYear = formatDate("dd/MM/yyyy")
export const formatMinutesHours = formatDate("HH:mm")
export const formatDateMonth = formatDate("dd/MM")
