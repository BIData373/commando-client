import { format, parse } from "date-fns";

const DATE_FORMAT = "dd/MM/yyyy";
const DATE_FORMAT_SHORT = "dd/MM/yy";

export function formatDate(date: Date): string {
	return format(date, DATE_FORMAT);
}

export function formatDateShort(date: Date): string {
	return format(date, DATE_FORMAT_SHORT);
}

export function parseDate(dateString: string): Date {
	return parse(dateString, DATE_FORMAT, new Date());
}
