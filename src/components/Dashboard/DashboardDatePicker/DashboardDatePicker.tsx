import { useState } from "react"
import { type DateRange, isDateRange } from "react-day-picker"
import { CalendarMode } from "src/components/shared/DatePicker"
import DatePickerPopover from "src/components/shared/DatePickerPopover"
import type { DATE_TYPE } from "src/utils/data-type-utils"
import { DashboardDatePickerFooter } from "./DashboardDatePickerFooter"
import { DashboardDatePickerHeader } from "./DashboardDatePickerHeader"
import { DashboardDatePickerTriggerButton } from "./DashboardDatePickerTriggerButton"

interface DashboardDatePickerProps {
	dateType: DATE_TYPE
	onDateTypeChange(value: DATE_TYPE): void
	setRange(range: DateRange | undefined): void
}

export function DashboardDatePicker({
	dateType,
	onDateTypeChange,
	setRange,
}: DashboardDatePickerProps) {
	const [pendingDataType, setPendingDataType] = useState(dateType)

	function handleConfirm(range: DateRange | undefined) {
		onDateTypeChange(pendingDataType)
		setRange(range)
	}

	return (
		<DatePickerPopover
			mode={CalendarMode.Range}
			triggerButton={({ value }) => (
				<DashboardDatePickerTriggerButton
					label={dateType}
					range={isDateRange(value) ? value : undefined}
				/>
			)}
			header={() => (
				<DashboardDatePickerHeader
					dateType={pendingDataType}
					onDateTypeChange={setPendingDataType}
				/>
			)}
			footer={(slotProps) => (
				<DashboardDatePickerFooter
					slots={slotProps}
					onConfirm={handleConfirm}
				/>
			)}
		/>
	)
}
