import styled from "@emotion/styled"
import { isSameDay } from "date-fns"
import { CalendarDays, ChevronDown } from "lucide-react"
import type { DateRange } from "react-day-picker"
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "src/components/ui/tooltip"
import { formatDateMonth, formatDateMonthFullYear } from "src/utils/time-format"

interface TasksDatePickerTriggerButtonProps {
	label: string
	showPlaceholder?: boolean
	range?: DateRange
	ref?: React.Ref<HTMLButtonElement>
}

export const TasksDatePickerTriggerButton = ({
	label,
	showPlaceholder = false,
	range,
	ref,
	...props
}: TasksDatePickerTriggerButtonProps) => {
	const hasRangeLabel = !!(label && range?.from && range.to)
	const hasText = hasRangeLabel || showPlaceholder

	return (
		<Tooltip>
			<TooltipTrigger asChild>
				<TriggerButton ref={ref} $active={hasRangeLabel} {...props}>
					<CalendarDays size={18} />
					{hasRangeLabel ? (
						<RangeLabel>
							{label}:{" "}
							{isSameDay(range!.from!, range!.to!)
								? formatDateMonthFullYear(range!.from!)
								: `${formatDateMonth(range!.from!)}-${formatDateMonth(range!.to!)}`}
						</RangeLabel>
					) : (
						showPlaceholder && <RangeLabel>סינון תאריכים</RangeLabel>
					)}
					<ChevronDown size={18} />
				</TriggerButton>
			</TooltipTrigger>
			{!hasText && <TooltipContent>סינון תאריכים</TooltipContent>}
		</Tooltip>
	)
}

const RangeLabel = styled.span`
    font-size: var(--fs-base);
`

const TriggerButton = styled.button<{ $active: boolean }>`
  direction: rtl;
  display: flex;
  padding: 0 15px;
  justify-content: center;
  align-items: center;
  align-self: flex-end;
  gap: 8px;
  height: 40px;
  border-radius: 8px;
  border: 1px solid ${({ $active }) => ($active ? "var(--active-color-button)" : "var(--card-border)")};
  background: var(--background);
  box-shadow: var(--shadow-button);
  cursor: pointer;
  white-space: nowrap;
  color: ${({ $active }) => ($active ? "var(--active-color-button)" : "var(--text-color-2)")};
  font-size: var(--fs-base);

  &:hover {
    background: var(--link-bg-hover);
  }
`
