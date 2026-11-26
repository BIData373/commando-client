import styled from "@emotion/styled"
import { Minus, Plus } from "lucide-react"
import { TEST_IDS } from "../../../consts/test-ids"
import {
	CALENDAR_RANGE_LABELS,
	CALENDAR_RANGES,
	type CalendarRange,
} from "../../../functions/calendar-range"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "../../ui/dropdown-menu"

interface CalendarRangeSelectorProps {
	range: CalendarRange
	onRangeChange: (range: CalendarRange) => void
}

export function CalendarRangeSelector({
	range,
	onRangeChange,
}: CalendarRangeSelectorProps) {
	const rangeIndex = CALENDAR_RANGES.indexOf(range)
	const isWidest = rangeIndex === CALENDAR_RANGES.length - 1
	const isNarrowest = rangeIndex === 0

	function handleExpand() {
		onRangeChange(CALENDAR_RANGES[rangeIndex + 1])
	}

	function handleShrink() {
		onRangeChange(CALENDAR_RANGES[rangeIndex - 1])
	}

	return (
		<Root>
			<StepButton
				data-testid={TEST_IDS.discussions.calendarRangeExpand}
				disabled={isWidest}
				onClick={handleExpand}
			>
				<Plus size={18} />
			</StepButton>

			<DropdownMenu>
				<RangeTrigger data-testid={TEST_IDS.discussions.calendarRangeTrigger}>
					{CALENDAR_RANGE_LABELS[range]}
				</RangeTrigger>

				<RangeList align="center" sideOffset={4}>
					{CALENDAR_RANGES.map((option) => (
						<RangeOption
							key={option}
							data-testid={TEST_IDS.discussions.calendarRangeOption}
							$selected={option === range}
							onSelect={() => onRangeChange(option)}
						>
							{CALENDAR_RANGE_LABELS[option]}
						</RangeOption>
					))}
				</RangeList>
			</DropdownMenu>

			<StepButton
				data-testid={TEST_IDS.discussions.calendarRangeShrink}
				disabled={isNarrowest}
				onClick={handleShrink}
			>
				<Minus size={18} />
			</StepButton>
		</Root>
	)
}

const Root = styled.div`
  display: flex;
  align-items: stretch;
  width: 160px;
  height: 40px;
  border: 1px solid var(--card-border);
  border-radius: 6px;
  background: var(--background);
  overflow: hidden;
`

const StepButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: none;
  width: 32px;
  padding: 0;
  border: none;
  background: transparent;
  color: var(--text-color-2);
  cursor: pointer;

  &:hover:not(:disabled) {
    background: var(--button-hover);
  }

  &:disabled {
    color: var(--Text-color-text-placeholder);
    cursor: not-allowed;
  }
`

const RangeTrigger = styled(DropdownMenuTrigger)`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-inline: 1px solid var(--card-border);
  background: transparent;
  font-size: var(--fs-base);
  line-height: 24px;
  color: var(--text-color-2);
  white-space: nowrap;
  cursor: pointer;

  &:hover,
  &[data-state='open'] {
    background: var(--button-hover);
  }
`

const RangeList = styled(DropdownMenuContent)`
  direction: rtl;
  width: 160px;
  min-width: 0;
  padding: 4px;
  border: none;
  border-radius: 8px;
  box-shadow: var(--boxShadowSecondary);
  z-index: var(--z-dropdown);
`

const RangeOption = styled(DropdownMenuItem)<{ $selected: boolean }>`
  height: 32px;
  padding-inline: 12px;
  border-radius: 4px;
  font-size: var(--fs-btn);
  line-height: 22px;
  color: var(--text-color-2);
  font-weight: ${({ $selected }) => ($selected ? 500 : 400)};
  background: ${({ $selected }) => ($selected ? "var(--selected-item)" : "transparent")};
  cursor: pointer;

  &:focus {
    background: ${({ $selected }) => ($selected ? "var(--selected-item)" : "var(--button-hover)")};
  }
`
