import styled from "@emotion/styled"
import { formatHebrewDayOfMonth } from "../../../functions/hebrew-date-utils"

interface CalendarDayCellTopProps {
	date: Date
	isToday: boolean
	/** Day outside the displayed month */
	isOther: boolean
}

export function CalendarDayCellTop({
	date,
	isToday,
	isOther,
}: CalendarDayCellTopProps) {
	return (
		<Root $isToday={isToday} $isOther={isOther}>
			<span>{date.getDate()}</span>
			<HebrewDate>{formatHebrewDayOfMonth(date)}</HebrewDate>
		</Root>
	)
}

const Root = styled.div<{ $isToday: boolean; $isOther: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  font-size: var(--fs-btn);
  line-height: 22px;
  white-space: nowrap;
  color: ${({ $isToday }) => ($isToday ? "var(--Colors-Base-Purple-6)" : "var(--text-color-2)")};
  opacity: ${({ $isOther }) => ($isOther ? 0.45 : 1)};
`

const HebrewDate = styled.span`
  opacity: 0.65;
`
