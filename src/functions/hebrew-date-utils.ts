import { gematriya, HDate, Locale } from "@hebcal/core"
import type { CalendarPeriod } from "./calendar-range"

const HEBREW_LOCALE = "he"

function getHebrewMonthName(hebrewDate: HDate): string {
	return Locale.gettext(hebrewDate.getMonthName(), HEBREW_LOCALE)
}

function getHebrewMonthAndYear(hebrewDate: HDate): string {
	return `${getHebrewMonthName(hebrewDate)} ${gematriya(hebrewDate.getFullYear())}`
}

/** Hebrew day of month in gematria, e.g. "כ״א" */
export function formatHebrewDayOfMonth(date: Date): string {
	return gematriya(new HDate(date).getDate())
}

/** Hebrew months covered by a Gregorian date range, e.g. "חֶשְׁוָן–כִּסְלֵו תשפ״ז" */
export function formatHebrewMonthRange({ start, end }: CalendarPeriod): string {
	const hebrewStart = new HDate(start)
	const hebrewEnd = new HDate(end)

	if (hebrewStart.getFullYear() !== hebrewEnd.getFullYear()) {
		return `${getHebrewMonthAndYear(hebrewStart)}–${getHebrewMonthAndYear(hebrewEnd)}`
	}

	const startMonth = getHebrewMonthName(hebrewStart)
	const endMonth = getHebrewMonthName(hebrewEnd)
	const months =
		startMonth === endMonth ? startMonth : `${startMonth}–${endMonth}`

	return `${months} ${gematriya(hebrewEnd.getFullYear())}`
}
