import { useEffect, useState } from "react"
import { type DateRange, isDateRange } from "react-day-picker"
import { CalendarMode } from "src/components/shared/DatePicker"
import DatePickerPopover from "src/components/shared/DatePickerPopover"
import { useTasksFilters } from "src/providers/TasksFiltersProvider"
import { TasksDatePickerHeader } from "./TasksDatePickerHeader"
import { TasksDatePickerTriggerButton } from "./TasksDatePickerTriggerButton"
import { TasksDatePickerFooter } from "./TasksPickerFooter"

export function TasksDatePicker() {
	const { dateType, setDateType, dateRange, setDateRange } = useTasksFilters()
	const [pendingDataType, setPendingDataType] = useState(dateType)

	useEffect(() => {
		setPendingDataType(dateType)
	}, [dateType])

	function handleConfirm(range: DateRange | undefined) {
		setDateType(pendingDataType)
		setDateRange(range)
	}

	return (
		<DatePickerPopover
			value={dateRange}
			mode={CalendarMode.Range}
			triggerButton={({ value }) => (
				<TasksDatePickerTriggerButton
					label={dateType}
					range={dateRange ?? (isDateRange(value) ? value : undefined)}
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
