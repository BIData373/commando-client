import { useState } from "react"
import type { DateRange } from "react-day-picker"
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

	function handleBlur() {
		setPendingDataType(dateType)
	}

	function handleConfirm(range: DateRange | undefined) {
		onDateTypeChange(pendingDataType)
		setRange(range)
	}

	return (
		<DateRangePicker
			onBlur={handleBlur}
			triggerButton={({ range }) => (
				<DashboardDatePickerTriggerButton label={dateType} range={range} />
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
