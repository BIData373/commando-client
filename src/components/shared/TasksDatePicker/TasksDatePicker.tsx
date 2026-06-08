import { useEffect, useState } from "react"
import { type DateRange, isDateRange } from "react-day-picker"
import { CalendarMode } from "src/components/shared/DatePicker"
import DatePickerPopover from "src/components/shared/DatePickerPopover"
import type { DATE_TYPE } from "src/utils/date-utils"
import { TasksDatePickerHeader } from "./TasksDatePickerHeader"
import { TasksDatePickerTriggerButton } from "./TasksDatePickerTriggerButton"
import { TasksDatePickerFooter } from "./TasksPickerFooter"

interface TasksDatePickerProps {
	dateType: DATE_TYPE
	range?: DateRange
	showTitle?: boolean
	onDateTypeChange(value: DATE_TYPE): void
	setRange(range: DateRange | undefined): void
}

export function TasksDatePicker({
	dateType,
	onDateTypeChange,
	setRange,
	range,
	showTitle = false,
}: TasksDatePickerProps) {
	const [pendingDataType, setPendingDataType] = useState(dateType)

	useEffect(() => {
		setPendingDataType(dateType)
	}, [dateType])

	function handleConfirm(range: DateRange | undefined) {
		onDateTypeChange(pendingDataType)
		setRange(range)
	}

	return (
		<DatePickerPopover
			value={range}
			mode={CalendarMode.Range}
			triggerButton={({ value }) => (
				<TasksDatePickerTriggerButton
					label={dateType}
					range={range ?? (isDateRange(value) ? value : undefined)}
					showTitle={showTitle}
				/>
			)}
			header={() => (
				<TasksDatePickerHeader
					dateType={pendingDataType}
					onDateTypeChange={setPendingDataType}
				/>
			)}
			footer={(slotProps) => (
				<TasksDatePickerFooter slots={slotProps} onConfirm={handleConfirm} />
			)}
		/>
	)
}
