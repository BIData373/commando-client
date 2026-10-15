import styled from "@emotion/styled"
import { type DateRange, isDateRange } from "react-day-picker"
import DatePicker, { CalendarMode } from "src/components/shared/DatePicker"
import {
	NativeSelect,
	NativeSelectOption,
} from "src/components/ui/native-select"
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
				<StyledNativeSelect
					value={dateType}
					onChange={(e) => onDateTypeChange(e.target.value as DATE_TYPE)}
				>
					{Object.values(DATE_TYPE).map((type) => (
						<NativeSelectOption key={type} value={type}>
							{type}
						</NativeSelectOption>
					))}
				</StyledNativeSelect>
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

const StyledNativeSelect = styled(NativeSelect)`
	[data-slot="native-select"] {
		height: 48px;
		border: 1px solid var(--line);
		border-radius: 6px;
		background: var(--background);
		color: var(--sea-ink);
		font-size: var(--fs-btn);

		&:focus-visible {
			border-color: var(--primary);
			color: var(--primary);
		}
	}
`

const CalendarWrapper = styled.div`
	display: flex;
	justify-content: center;
	border-radius: 6px;
	box-shadow: var(--shadow-calendar-mobile);
`
