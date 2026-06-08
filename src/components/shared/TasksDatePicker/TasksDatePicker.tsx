import { useEffect, useState } from "react"
import { type DateRange, isDateRange } from "react-day-picker"
import { CalendarMode } from "src/components/shared/DatePicker"
import DatePickerPopover from "src/components/shared/DatePickerPopover"
import { useTasksFilters } from "src/providers/TasksFiltersProvider"
import { TasksDatePickerHeader } from "./TasksDatePickerHeader"
import { TasksDatePickerTriggerButton } from "./TasksDatePickerTriggerButton"
import { TasksDatePickerFooter } from "./TasksPickerFooter"

interface TasksDatePickerProps {
	showTitle?: boolean
}

export function TasksDatePicker({ showTitle = false }: TasksDatePickerProps) {
	const { dateType, setDateType, dateRange: range, setDateRange: setRange } = useTasksFilters()
	const [pendingDataType, setPendingDataType] = useState(dateType)

	useEffect(() => {
		setPendingDataType(dateType)
	}, [dateType])

	function handleConfirm(range: DateRange | undefined) {
		setDateType(pendingDataType)
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
