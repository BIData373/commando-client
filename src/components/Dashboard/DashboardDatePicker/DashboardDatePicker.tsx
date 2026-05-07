import type { DateRange } from 'react-day-picker'
import DateRangePicker from '#/components/shared/DateRangePicker'
import type { DATE_TYPE } from '#/utils/dataTypeUtils'
import { DashboardDatePickerFooter } from './DashboardDatePickerFooter'
import { DashboardDatePickerHeader } from './DashboardDatePickerHeader'
import { DashboardDatePickerTriggerButton } from './DashboardDatePickerTriggerButton'

interface DashboardDatePickerProps {
  dateType: string
  onDateTypeChange(value: DATE_TYPE): void
  setRange(range: DateRange | undefined): void
}

export function DashboardDatePicker({
  dateType,
  onDateTypeChange,
  setRange
}: DashboardDatePickerProps) {
  return (
    <DateRangePicker
      triggerButton={({ range }) => <DashboardDatePickerTriggerButton label={dateType} range={range} />}
      header={() => <DashboardDatePickerHeader dateType={dateType} onDateTypeChange={onDateTypeChange} />}
      footer={(slotProps) => <DashboardDatePickerFooter slots={slotProps} onConfirm={setRange} />}
    />
  )
}