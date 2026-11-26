import styled from "@emotion/styled"
import { Calendar1, ChevronLeft, ChevronRight } from "lucide-react"
import { TEST_IDS } from "../../../consts/test-ids"
import {
	type CalendarRange,
	formatCalendarPeriodLabel,
	getCalendarPeriod,
} from "../../../functions/calendar-range"
import { formatHebrewMonthRange } from "../../../functions/hebrew-date-utils"
import { Tooltip, TooltipContent, TooltipTrigger } from "../../ui/tooltip"

const TODAY_TOOLTIP = "חזור להיום"

interface CalendarDateNavigationProps {
	anchorDate: Date
	range: CalendarRange
	onPrevious: () => void
	onNext: () => void
	onToday: () => void
}

export function CalendarDateNavigation({
	anchorDate,
	range,
	onPrevious,
	onNext,
	onToday,
}: CalendarDateNavigationProps) {
	const period = getCalendarPeriod(anchorDate, range)

	return (
		<Root>
			<MonthNavigation>
				<ArrowButton
					data-testid={TEST_IDS.discussions.calendarPrevious}
					onClick={onPrevious}
				>
					<ChevronRight size={16} />
				</ArrowButton>

				<MonthLabel>
					<GregorianLabel>
						{formatCalendarPeriodLabel(anchorDate, range, period)}
					</GregorianLabel>
					<span>{formatHebrewMonthRange(period)}</span>
				</MonthLabel>

				<ArrowButton
					data-testid={TEST_IDS.discussions.calendarNext}
					onClick={onNext}
				>
					<ChevronLeft size={16} />
				</ArrowButton>
			</MonthNavigation>

			<Tooltip>
				<TooltipTrigger asChild>
					<TodayButton
						data-testid={TEST_IDS.discussions.calendarToday}
						onClick={onToday}
					>
						<Calendar1 size={18} />
					</TodayButton>
				</TooltipTrigger>
				<TooltipContent>{TODAY_TOOLTIP}</TooltipContent>
			</Tooltip>
		</Root>
	)
}

const Root = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`

const MonthNavigation = styled.div`
  display: flex;
  align-items: center;
`

const ArrowButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: var(--text-color-2);
  cursor: pointer;

  &:hover {
    background: var(--button-hover);
  }
`

const TodayButton = styled(ArrowButton)`
  width: 40px;
  height: 40px;
  border-radius: 8px;
`

const MonthLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  height: 32px;
  padding-inline: 8px;
  font-size: var(--fs-base);
  line-height: 24px;
  color: var(--text-color);
  white-space: nowrap;
`

const GregorianLabel = styled.span`
  font-weight: 500;
`
