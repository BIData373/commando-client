import { useState } from "react";
import type { DateRange } from "react-day-picker";
import type { DATE_TYPE } from "src/utils/dataTypeUtils";
import { DashboardDatePickerFooter } from "./DashboardDatePickerFooter";
import { DashboardDatePickerHeader } from "./DashboardDatePickerHeader";
import { DashboardDatePickerTriggerButton } from "./DashboardDatePickerTriggerButton";
import DatePickerPopover from "src/components/shared/DatePickerPopover";
import { CalendarMode } from "src/components/shared/DatePicker";

interface DashboardDatePickerProps {
	dateType: DATE_TYPE;
	onDateTypeChange(value: DATE_TYPE): void;
	setRange(range: DateRange | undefined): void;
}

export function DashboardDatePicker({
	dateType,
	onDateTypeChange,
	setRange,
}: DashboardDatePickerProps) {
	const [pendingDataType, setPendingDataType] = useState(dateType);

	function handleConfirm(range: DateRange | undefined) {
		onDateTypeChange(pendingDataType);
		setRange(range);
	}

	return (
		<DatePickerPopover
			mode={CalendarMode.Range}
			triggerButton={({ value }) => (
				<DashboardDatePickerTriggerButton label={dateType} range={value as DateRange} />
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
	);
}
