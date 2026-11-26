import type { CalendarOptions } from "@fullcalendar/react"
import {
	addDays,
	addMonths,
	addWeeks,
	differenceInCalendarWeeks,
	endOfMonth,
	endOfWeek,
	format,
	getWeek,
	isSameMonth,
	isSameYear,
	startOfMonth,
	startOfWeek,
	subWeeks,
} from "date-fns"
import { he } from "date-fns/locale"

export enum CalendarRange {
	THREE_DAYS = "THREE_DAYS",
	WEEK = "WEEK",
	TWO_WEEKS = "TWO_WEEKS",
	MONTH = "MONTH",
}

export interface CalendarPeriod {
	start: Date
	end: Date
}

/** Ordered from the narrowest range to the widest */
export const CALENDAR_RANGES = [
	CalendarRange.THREE_DAYS,
	CalendarRange.WEEK,
	CalendarRange.TWO_WEEKS,
	CalendarRange.MONTH,
]

export const CALENDAR_RANGE_LABELS: Record<CalendarRange, string> = {
	[CalendarRange.THREE_DAYS]: "3 ימים",
	[CalendarRange.WEEK]: "שבוע",
	[CalendarRange.TWO_WEEKS]: "שבועיים",
	[CalendarRange.MONTH]: "חודש",
}

export const THREE_DAYS_LENGTH = 3

/** Single-row ranges show each date in the column header instead of inside the cell */
export function isSingleRowRange(range: CalendarRange): boolean {
	return range === CalendarRange.THREE_DAYS || range === CalendarRange.WEEK
}

/** View names are the range values, so a range maps directly to its FullCalendar view */
export const CALENDAR_VIEWS: CalendarOptions["views"] = {
	[CalendarRange.THREE_DAYS]: { type: "dayGrid", dayCount: THREE_DAYS_LENGTH },
	[CalendarRange.WEEK]: { type: "dayGrid", duration: { weeks: 1 } },
	[CalendarRange.TWO_WEEKS]: { type: "dayGrid", duration: { weeks: 2 } },
	[CalendarRange.MONTH]: { type: "dayGridMonth", fixedWeekCount: false },
}

const DATE_FORMAT_OPTIONS = { locale: he }
const MONTH_YEAR_FORMAT = "LLLL yyyy"
const DAY_FORMAT = "d"
const DAY_MONTH_FORMAT = "d בMMMM"
const FULL_DATE_FORMAT = "d בMMMM yyyy"

/** The displayed period for a range; it always contains the anchor date */
export function getCalendarPeriod(
	anchorDate: Date,
	range: CalendarRange,
): CalendarPeriod {
	switch (range) {
		case CalendarRange.THREE_DAYS:
			return {
				start: anchorDate,
				end: addDays(anchorDate, THREE_DAYS_LENGTH - 1),
			}
		case CalendarRange.WEEK:
			return { start: startOfWeek(anchorDate), end: endOfWeek(anchorDate) }
		case CalendarRange.TWO_WEEKS:
			// The anchor's week is the second week of the pair
			return {
				start: startOfWeek(subWeeks(anchorDate, 1)),
				end: endOfWeek(anchorDate),
			}
		case CalendarRange.MONTH:
			return { start: startOfMonth(anchorDate), end: endOfMonth(anchorDate) }
	}
}

/** How many week rows the calendar grid shows for a range */
export function getCalendarRowCount(
	{ start, end }: CalendarPeriod,
	range: CalendarRange,
): number {
	return isSingleRowRange(range) ? 1 : differenceInCalendarWeeks(end, start) + 1
}

/** Moves the anchor date by one range unit; `direction` is 1 (forward) or -1 (backward) */
export function shiftAnchorDate(
	anchorDate: Date,
	range: CalendarRange,
	direction: 1 | -1,
): Date {
	switch (range) {
		case CalendarRange.THREE_DAYS:
			return addDays(anchorDate, THREE_DAYS_LENGTH * direction)
		case CalendarRange.WEEK:
			return addWeeks(anchorDate, direction)
		case CalendarRange.TWO_WEEKS:
			return addWeeks(anchorDate, 2 * direction)
		case CalendarRange.MONTH:
			return addMonths(anchorDate, direction)
	}
}

function formatDate(date: Date, pattern: string): string {
	return format(date, pattern, DATE_FORMAT_OPTIONS)
}

/** e.g. "8–14 בנובמבר 2026", "29 בנובמבר – 5 בדצמבר 2026" */
function formatDayRange({ start, end }: CalendarPeriod): string {
	if (!isSameYear(start, end)) {
		return `${formatDate(start, FULL_DATE_FORMAT)} – ${formatDate(end, FULL_DATE_FORMAT)}`
	}

	if (!isSameMonth(start, end)) {
		return `${formatDate(start, DAY_MONTH_FORMAT)} – ${formatDate(end, FULL_DATE_FORMAT)}`
	}

	return `${formatDate(start, DAY_FORMAT)}–${formatDate(end, FULL_DATE_FORMAT)}`
}

/** The Gregorian label shown in the calendar navigation */
export function formatCalendarPeriodLabel(
	anchorDate: Date,
	range: CalendarRange,
	period: CalendarPeriod,
): string {
	switch (range) {
		case CalendarRange.MONTH:
			return formatDate(anchorDate, MONTH_YEAR_FORMAT)
		case CalendarRange.WEEK:
			return `שבוע ${getWeek(anchorDate)} · ${formatDayRange(period)}`
		default:
			return formatDayRange(period)
	}
}
