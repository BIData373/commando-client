import styled from "@emotion/styled"
import { formatHebrewDayOfMonth } from "../../../functions/hebrew-date-utils"
import { formatDateMonth } from "../../../utils/time-format"

const WEEKDAY_NAMES = ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"]

interface CalendarDayHeaderProps {
	date: Date
	isToday: boolean
	/** Single-row ranges show the date under the weekday name */
	showDate: boolean
}

export function CalendarDayHeader({
	date,
	isToday,
	showDate,
}: CalendarDayHeaderProps) {
	const weekdayName = WEEKDAY_NAMES[date.getDay()]

	return !showDate ? (
		<WeekdayOnly>{weekdayName}</WeekdayOnly>
	) : (
		<Root $isToday={isToday}>
			<Weekday $isToday={isToday}>{weekdayName}</Weekday>
			<Dates>
				<GregorianDate>{formatDateMonth(date)}</GregorianDate>
				<HebrewDate>{formatHebrewDayOfMonth(date)}</HebrewDate>
			</Dates>
		</Root>
	)
}

const WeekdayOnly = styled.span`
  display: block;
  padding-block: 8px;
  padding-inline: 16px;
  font-size: var(--fs-btn);
  line-height: 22px;
  color: var(--text-color);
  text-align: start;
`

const Root = styled.div<{ $isToday: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
  padding-block: 8px;
  padding-inline: 12px;
  line-height: 22px;
  white-space: nowrap;
  color: ${({ $isToday }) => ($isToday ? "var(--Colors-Base-Purple-6)" : "var(--text-color)")};
`

const Weekday = styled.span<{ $isToday: boolean }>`
  font-size: var(--fs-btn);
  opacity: ${({ $isToday }) => ($isToday ? 1 : 0.65)};
`

const Dates = styled.div`
  display: flex;
  align-items: baseline;
  gap: 8px;
`

const GregorianDate = styled.span`
  font-size: var(--fs-xl);
  font-weight: 500;
`

const HebrewDate = styled.span`
  font-size: var(--fs-sm);
  opacity: 0.8;
`
