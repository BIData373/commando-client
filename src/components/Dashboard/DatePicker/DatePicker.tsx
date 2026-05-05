import type { DateRange } from 'react-day-picker'
import DateRangePicker from '#/components/shared/DateRangePicker'
import { DatePickerFooter } from './DatePickerFooter'
import { DatePickerHeader } from './DatePickerHeader'
import { DatePickerTriggerButton } from './DatePickerTriggerButton'

interface DatePickerProps {
  dateType: string
  onDateTypeChange(value: string): void
  setRange(range: DateRange | undefined): void
}

export function DatePicker({
  dateType,
  onDateTypeChange,
  setRange
}: DatePickerProps) {
  return (
    <DateRangePicker
      triggerButton={({ range }) => <DatePickerTriggerButton label={dateType} range={range} />}
      header={() => <DatePickerHeader dateType={dateType} onDateTypeChange={onDateTypeChange} />}
      footer={(slotProps) => <DatePickerFooter slots={slotProps} onConfirm={setRange} />}
    />
  )
}