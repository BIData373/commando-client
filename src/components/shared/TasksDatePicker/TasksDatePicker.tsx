import { useEffect, useState } from "react"
import { isDateRange } from "react-day-picker"
import { CalendarMode } from "src/components/shared/DatePicker"
import DatePickerPopover from "src/components/shared/DatePickerPopover"
import { useTasksFilters } from "src/providers/TasksFiltersProvider"
import type { DatePickerValue } from "src/utils/date-utils"
import { TasksDatePickerHeader } from "./TasksDatePickerHeader"
import { TasksDatePickerTriggerButton } from "./TasksDatePickerTriggerButton"
import { TasksDatePickerFooter } from "./TasksPickerFooter"

export function TasksDatePicker() {
	const { dateType, setDateType, dateRange, setDateRange } = useTasksFilters()
	const [pendingDataType, setPendingDataType] = useState(dateType)

	useEffect(() => {
		setPendingDataType(dateType)
	}, [dateType])

	function handleConfirm(range: DatePickerValue | undefined) {
		setDateType(pendingDataType)
		setDateRange(isDateRange(range) ? range : undefined)
	}

	return (
		<DatePickerPopover
			value={dateRange}
			mode={CalendarMode.Range}
			hasConfirm
			onChange={handleConfirm}
			triggerButton={({ value }) => (
				<TasksDatePickerTriggerButton
					label={dateType}
					range={isDateRange(value) ? value : undefined}
				/>
			)}
			header={() => (
				<TasksDatePickerHeader
					dateType={pendingDataType}
					onDateTypeChange={setPendingDataType}
				/>
			)}
			footer={(slotProps) => <TasksDatePickerFooter slots={slotProps} />}
		/>
	)
}
