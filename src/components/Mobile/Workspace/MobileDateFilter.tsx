import styled from "@emotion/styled"
import { ChevronDown } from "lucide-react"
import { type DateRange, isDateRange } from "react-day-picker"
import DatePicker, { CalendarMode } from "src/components/shared/DatePicker"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "src/components/ui/dropdown-menu"
import { DATE_TYPE, type DatePickerValue } from "src/utils/date-utils"

interface MobileDateFilterProps {
	dateType: DATE_TYPE
	dateRange: DateRange | undefined
	onDateTypeChange: (type: DATE_TYPE) => void
	onDateRangeChange: (range: DateRange | undefined) => void
}

export default function MobileDateFilter({
	dateType,
	dateRange,
	onDateTypeChange,
	onDateRangeChange,
}: MobileDateFilterProps) {
	function handleSelect(val: DatePickerValue | undefined) {
		onDateRangeChange(isDateRange(val) ? val : undefined)
	}

	return (
		<Wrapper>
			<FilterRow>
				<FilterLabel>סנן לפי:</FilterLabel>
				<DropdownMenu>
					<DateTypeTrigger>
						{dateType}
						<ChevronDown size={16} />
					</DateTypeTrigger>
					<StyledDropdownMenuContent align="start" sideOffset={6}>
						{Object.values(DATE_TYPE).map((type) => (
							<DateTypeItem
								key={type}
								$selected={type === dateType}
								dir="rtl"
								onSelect={() => onDateTypeChange(type)}
							>
								{type}
							</DateTypeItem>
						))}
					</StyledDropdownMenuContent>
				</DropdownMenu>
			</FilterRow>

			<CalendarWrapper>
				<DatePicker
					mode={CalendarMode.Range}
					selected={dateRange}
					showWeekNumber={true}
					onSelect={handleSelect}
				/>
			</CalendarWrapper>
		</Wrapper>
	)
}

const Wrapper = styled.div`
	display: flex;
	flex-direction: column;
	gap: 20px;
`

const FilterRow = styled.div`
	display: flex;
	align-items: center;
	justify-content: flex-start;
	gap: 8px;
	align-self: stretch;
`

const FilterLabel = styled.span`
	font-size: var(--fs-base);
	font-weight: 600;
	color: var(--sea-ink-soft);
	white-space: nowrap;
`

const DateTypeTrigger = styled(DropdownMenuTrigger)`
	display: inline-flex;
	align-items: center;
	gap: 6px;
	height: 48px;
	padding: 0 16px;
	border: 1px solid var(--line);
	border-radius: 6px;
	background: var(--background);
	color: var(--sea-ink);
	font-size: var(--fs-btn);
	white-space: nowrap;

	&:hover {
		background: var(--chip-bg);
	}

	&[data-state="open"] {
		color: var(--primary);
		border-color: var(--primary);
	}
`

const StyledDropdownMenuContent = styled(DropdownMenuContent)`
	padding: 4px;
	background: var(--background);
	border-radius: 6px;
	box-shadow: var(--shadow-popover);
	z-index: var(--z-dropdown);
	animation: none !important;
`

const DateTypeItem = styled(DropdownMenuItem)<{ $selected: boolean }>`
	padding: 0.4rem;
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: flex-start;
	border-radius: 6px;
	background: ${({ $selected }) =>
		$selected ? "var(--link-bg-hover)" : "transparent"};
	color: var(--sea-ink);
	font-size: var(--fs-btn);
	text-align: start;

	&:focus {
		background: var(--link-bg-hover);
	}
`

const CalendarWrapper = styled.div`
	display: flex;
	justify-content: center;
`
