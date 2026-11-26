import { css } from "@emotion/react"
import styled from "@emotion/styled"
import FullCalendar, {
	type CalendarRef,
	type DayCellInfo,
	type DayHeaderInfo,
	type EventDisplayInfo,
} from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/react/daygrid"
import heLocale from "@fullcalendar/react/locales/he"
import "@fullcalendar/react/skeleton.css"
import { eachDayOfInterval, format, getWeek } from "date-fns"
import { useEffect, useRef, useState } from "react"
import type { SourceDto } from "../../../api/model"
import {
	CALENDAR_VIEWS,
	type CalendarRange,
	getCalendarPeriod,
	getCalendarRowCount,
	isSingleRowRange,
} from "../../../functions/calendar-range"
import { layerFill } from "../../../functions/color-utils"
import {
	buildDiscussionCalendarEvents,
	CalendarEventKind,
	type CalendarEventProps,
} from "../../../functions/discussion-calendar-events"
import { CalendarDayCellTop } from "./CalendarDayCellTop"
import { CalendarDayHeader } from "./CalendarDayHeader"
import { CalendarDiscussionChip } from "./CalendarDiscussionChip"
import { CalendarMoreLink } from "./CalendarMoreLink"

/** Stable class names injected into FullCalendar (its own classes are hashed) */
const CALENDAR_CLASS = {
	row: "discussions-calendar-row",
	headerRow: "discussions-calendar-header-row",
	dayHeader: "discussions-calendar-day-header",
	dayCell: "discussions-calendar-day-cell",
	today: "discussions-calendar-today",
	event: "discussions-calendar-event",
	weekNumber: "discussions-calendar-week-number",
}

const WEEK_COLUMN_LABEL = "שבוע"

/** Matches FullCalendar's data-date attribute on day headers and day cells */
const DATA_DATE_FORMAT = "yyyy-MM-dd"

interface DiscussionsCalendarProps {
	anchorDate: Date
	range: CalendarRange
	discussions: SourceDto[]
}

export function DiscussionsCalendar({
	anchorDate,
	range,
	discussions,
}: DiscussionsCalendarProps) {
	const calendarRef = useRef<CalendarRef>(null)
	const [expandedWeeks, setExpandedWeeks] = useState<number[]>([])
	const events = buildDiscussionCalendarEvents(
		discussions,
		expandedWeeks,
		range,
	)
	const period = getCalendarPeriod(anchorDate, range)
	const periodStartTime = period.start.getTime()
	const showDateInHeader = isSingleRowRange(range)
	const rowCount = getCalendarRowCount(period, range)
	const linkedDates = showDateInHeader
		? eachDayOfInterval(period).map((date) => format(date, DATA_DATE_FORMAT))
		: []

	useEffect(() => {
		calendarRef.current?.getApi().changeView(range, new Date(periodStartTime))
	}, [range, periodStartTime])

	function getWeekNumber(date: Date) {
		return getWeek(date)
	}

	// In single-row views today is marked on the header, the cell itself stays white
	function getDayCellClass({ isToday }: DayCellInfo) {
		return isToday && !showDateInHeader
			? `${CALENDAR_CLASS.dayCell} ${CALENDAR_CLASS.today}`
			: CALENDAR_CLASS.dayCell
	}

	function getDayHeaderClass({ isToday }: DayHeaderInfo) {
		return isToday && showDateInHeader
			? `${CALENDAR_CLASS.dayHeader} ${CALENDAR_CLASS.today}`
			: CALENDAR_CLASS.dayHeader
	}

	function renderDayHeader({ date, isToday }: DayHeaderInfo) {
		return (
			<CalendarDayHeader
				date={date}
				isToday={isToday}
				showDate={showDateInHeader}
			/>
		)
	}

	function toggleWeek(weekStart: number) {
		setExpandedWeeks((weeks) =>
			weeks.includes(weekStart)
				? weeks.filter((week) => week !== weekStart)
				: [...weeks, weekStart],
		)
	}

	function renderEvent({ event, isToday }: EventDisplayInfo) {
		const eventProps = event.extendedProps as CalendarEventProps

		return eventProps.kind === CalendarEventKind.DISCUSSION ? (
			<CalendarDiscussionChip
				title={event.title}
				isToday={isToday && !showDateInHeader}
			/>
		) : (
			<CalendarMoreLink
				hiddenCount={eventProps.hiddenCount}
				isExpanded={eventProps.kind === CalendarEventKind.COLLAPSE}
				onToggle={() => toggleWeek(eventProps.weekStart)}
			/>
		)
	}

	return (
		<Root
			$singleRow={showDateInHeader}
			$rowCount={rowCount}
			$linkedDates={linkedDates}
		>
			<FullCalendar
				ref={calendarRef}
				plugins={[dayGridPlugin]}
				locale={heLocale}
				views={CALENDAR_VIEWS}
				initialView={range}
				initialDate={period.start}
				events={events}
				eventOrder={"order"}
				height="100%"
				firstDay={0}
				weekNumbers
				weekNumberCalculation={getWeekNumber}
				dayHeaderRowClass={CALENDAR_CLASS.headerRow}
				dayRowClass={CALENDAR_CLASS.row}
				dayHeaderClass={getDayHeaderClass}
				dayHeaderContent={renderDayHeader}
				dayCellClass={getDayCellClass}
				dayCellTopContent={showDateInHeader ? null : CalendarDayCellTop}
				eventClass={CALENDAR_CLASS.event}
				eventContent={renderEvent}
				inlineWeekNumberClass={CALENDAR_CLASS.weekNumber}
				weekNumberFormat={{ week: "numeric" }}
			/>
		</Root>
	)
}

/**
 * In single-row views a day's header and column react together: hovering or pressing either one
 * colors both. They sit in separate rows, so they're linked through their shared data-date.
 */
function getLinkedDayStateStyles(date: string) {
	const day = `[data-date="${date}"]`
	const header = `.${CALENDAR_CLASS.dayHeader}${day}`
	const todayHeader = `.${CALENDAR_CLASS.dayHeader}.${CALENDAR_CLASS.today}${day}`

	return css`
	&:has(${day}:hover) ${day} {
	  background: var(--Components-Dropdown-Global-controlItemBgHover);
	}

	&:has(${day}:active) ${day} {
	  background: var(--button-hover);
	}

	/* In Figma the header sits on the column, so its translucent fill is layered twice */
	&:has(${day}:hover) ${header} {
	  background: ${layerFill("var(--Components-Dropdown-Global-controlItemBgHover)", "var(--Components-Dropdown-Global-controlItemBgHover)")};
	}

	&:has(${day}:active) ${header} {
	  background: ${layerFill("var(--button-hover)", "var(--button-hover)")};
	}

	&:has(${day}:hover) ${todayHeader} {
	  background: var(--Colors-Base-Purple-2);
	}

	&:has(${day}:active) ${todayHeader} {
	  background: var(--Colors-Base-Purple-3);
	}
  `
}

interface RootProps {
	$singleRow: boolean
	$rowCount: number
	$linkedDates: string[]
}

const Root = styled.div<RootProps>`
  container-type: size;
  flex: 1;
  min-height: 0;
  border: 1px solid var(--colors-base-neutral-11);
  border-radius: 8px;
  background: var(--background);
  overflow: hidden;

  /*
   * Grid lines follow FullCalendar's own split: rows draw the horizontal lines, cells the
   * vertical ones. Its border utilities (!important) remove the duplicated edges.
   */
  .${CALENDAR_CLASS.row},
  .${CALENDAR_CLASS.dayCell} {
    border-style: solid;
    border-width: 1px;
    border-color: var(--colors-base-neutral-11);
}

  /*
   * One line under the whole heading row, drawn as a shadow since FullCalendar forces the
   * header row's bottom border to 0. Lines between headings only in single-row views.
   */
  .${CALENDAR_CLASS.headerRow} {
    box-shadow: inset 0 -1px 0 var(--colors-base-neutral-11);
  }

  ${({ $singleRow }) =>
		$singleRow &&
		`
  .${CALENDAR_CLASS.dayHeader} {
      border-style: solid;
      border-width: 1px;
      border-color: var(--colors-base-neutral-11);
    }
  `}

  /*
   * Each week row keeps its share of the calendar height, so an expanded week grows the grid
   * and scrolls it instead of squeezing the other weeks.
   */
  ${({ $singleRow, $rowCount }) =>
		!$singleRow &&
		css`
    .${CALENDAR_CLASS.headerRow} {
      height: 38px;
    }

    /* FullCalendar has no week-number header cell in day grids, so the heading is drawn here */
    .${CALENDAR_CLASS.headerRow}::before {
		content: "${WEEK_COLUMN_LABEL}";
		flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 48px;
      border-inline-end: 1px solid var(--colors-base-neutral-11);
      font-size: var(--fs-btn);
      line-height: 22px;
      color: var(--text-color);
    }

    /*
     * A basis, not min-height: an explicit min-height would drop the content-based minimum and
	* let an expanded week's discussions overflow its row. !important beats FullCalendar's inline
	* flex-basis.
     */
	.${CALENDAR_CLASS.row} {
      flex-basis: calc((100cqh - 38px) / ${$rowCount}) !important;
      flex-shrink: 0;
    }
  `}

  .${CALENDAR_CLASS.dayCell} {
    padding: 8px !important;
    /* !important beats FullCalendar's min-height: 0 !important on cells */
    min-height: 162px !important;
    cursor: pointer;

    &:hover {
      background: var(--card-background);
    }

    &:active {
      background: var(--button-hover);
    }
  }

  .${CALENDAR_CLASS.today} {
    background: var(--Colors-Base-Purple-1);
}

.${CALENDAR_CLASS.dayCell}.${CALENDAR_CLASS.today},
.${CALENDAR_CLASS.dayHeader}.${CALENDAR_CLASS.today} {
	cursor: pointer;

    &:hover {
		background: var(--Colors-Base-Purple-2);
    }

    &:active {
		background: var(--Colors-Base-Purple-3);
    }
}

${({ $linkedDates }) => $linkedDates.map(getLinkedDayStateStyles).join("")}

.${CALENDAR_CLASS.event} {
    margin-block-start: 4px;
    border: none;
    background: none;
  }

  /* The week number is the row's first item, so in RTL it forms the rightmost column */
  .${CALENDAR_CLASS.weekNumber} {
    flex-shrink: 0;
    width: 48px;
    padding-block-start: 8px;
    border-inline-end: 1px solid var(--colors-base-neutral-11);
    font-size: var(--fs-btn);
    line-height: 22px;
    color: var(--text-color);
    text-align: center;
    cursor: pointer;

    &:hover {
      background: var(--Components-Dropdown-Global-controlItemBgHover);
    }

    &:active {
      background: var(--button-hover);
    }
  }
`
