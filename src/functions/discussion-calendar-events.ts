import type { EventInput } from "@fullcalendar/react"
import { startOfDay, startOfWeek } from "date-fns"
import { groupBy, orderBy } from "lodash"
import type { SourceDto } from "../api/model"
import { CalendarRange } from "./calendar-range"

const VISIBLE_DISCUSSIONS_PER_DAY = 3

/** Each day's list holds its discussions, then an expand/collapse toggle when it overflows */
export enum CalendarEventKind {
	DISCUSSION = "DISCUSSION",
	EXPAND = "EXPAND",
	COLLAPSE = "COLLAPSE",
}

interface DiscussionEventProps {
	kind: CalendarEventKind.DISCUSSION
	order: number
}

interface ToggleEventProps {
	kind: CalendarEventKind.EXPAND | CalendarEventKind.COLLAPSE
	order: number
	weekStart: number
	hiddenCount: number
}

/** Stored on each event's extendedProps; `order` keeps the toggle after the discussions */
export type CalendarEventProps = DiscussionEventProps | ToggleEventProps

function hasDate(
	discussion: SourceDto,
): discussion is SourceDto & { date: Date } {
	return discussion.date !== null
}

/** Day start timestamp → that day's discussions, newest-created first */
function groupByDay(discussions: SourceDto[]) {
	return groupBy(
		orderBy(discussions.filter(hasDate), "createdAt", "desc"),
		(discussion) => startOfDay(discussion.date).getTime(),
	)
}

/**
 * Builds the calendar's events: up to the range's cap of discussions per day and a "+N" toggle for
 * the rest. Expanding a week shows every discussion on each of its days, with a collapse toggle
 * instead. Uncapped ranges show every discussion with no toggle.
 */
export function buildDiscussionCalendarEvents(
	discussions: SourceDto[],
	expandedWeeks: number[],
	range: CalendarRange,
): EventInput[] {
	// Only the month view caps each day; shorter ranges show every discussion and scroll
	const visiblePerDay =
		range === CalendarRange.MONTH
			? VISIBLE_DISCUSSIONS_PER_DAY
			: Number.POSITIVE_INFINITY

	return Object.entries(groupByDay(discussions)).flatMap(
		([dayKey, dayDiscussions]) => {
			const dayStart = Number(dayKey)
			const weekStart = startOfWeek(dayStart).getTime()
			const isExpanded = expandedWeeks.includes(weekStart)
			const hiddenCount = dayDiscussions.length - visiblePerDay
			const overflows = hiddenCount > 0
			const visibleDiscussions =
				overflows && !isExpanded
					? dayDiscussions.slice(0, visiblePerDay)
					: dayDiscussions

			const events: EventInput[] = visibleDiscussions.map(
				({ id, name }, index) => ({
					id: String(id),
					title: name,
					start: dayStart,
					allDay: true,
					extendedProps: {
						kind: CalendarEventKind.DISCUSSION,
						order: index,
					} satisfies DiscussionEventProps,
				}),
			)

			const toggleEvent: EventInput = {
				id: `toggle-${dayStart}`,
				start: dayStart,
				allDay: true,
				extendedProps: {
					kind: isExpanded
						? CalendarEventKind.COLLAPSE
						: CalendarEventKind.EXPAND,
					order: visibleDiscussions.length,
					weekStart,
					hiddenCount,
				} satisfies ToggleEventProps,
			}

			return overflows ? [...events, toggleEvent] : events
		},
	)
}
