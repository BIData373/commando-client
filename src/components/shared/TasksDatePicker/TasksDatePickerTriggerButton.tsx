import styled from "@emotion/styled"
import { isSameDay } from "date-fns"
import { CalendarDays, ChevronDown } from "lucide-react"
import type { DateRange } from "react-day-picker"
import { formatDateMonth, formatDateMonthFullYear } from "src/utils/time-format"

interface TasksDatePickerTriggerButtonProps {
	label: string
	range?: DateRange
	ref?: React.Ref<HTMLButtonElement>
}

export const TasksDatePickerTriggerButton = ({
	label,
	range,
	ref,
	...props
}: TasksDatePickerTriggerButtonProps) => {
	return (
		<TriggerButton ref={ref} {...props}>
			<CalendarDays size={16} />
			{label && range?.from && range.to ? (
				<RangeLabel>
					{label}:{" "}
					{isSameDay(range.from, range.to)
						? formatDateMonthFullYear(range.from)
						: `${formatDateMonth(range.from)}-${formatDateMonth(range.to)}`}
				</RangeLabel>
			) : (
				<RangeLabel>טווח תאריכים</RangeLabel>
			)}
			<ChevronDown size={16} />
		</TriggerButton>
	)
}

const RangeLabel = styled.span`
    font-size: var(--fs-base);
`

const TriggerButton = styled.button`
  direction: rtl;
  display: flex;
  align-items: center;
  gap: 8px;
  height: 32px;
  padding: 18px 15px;
  border: 1px solid var(--card-border);
  color:var(--text-color-2);
  border-radius: 8px;
  background: var(--background);
  font-size: var(--fs-base);
  font-weight: 400;
  cursor: pointer;
  white-space: nowrap;
  align-self: flex-end;
  transition: opacity 0.15s;

  &:hover {
    opacity: 0.8;
  }
`
