import { useState } from 'react'
import DateRangePicker from '../../shared/DateRangePicker'
import { DatePickerFooter } from './DatePickerFooter'
import { DATE_TYPES, DatePickerHeader } from './DatePickerHeader'
import { DatePickerTriggerButton } from './DatePickerTriggerButton'


export function DatePicker() {
  const [dateType, setDateType] = useState<string>(DATE_TYPES[0])

  function handleDateTypeChange(type: string) {
    setDateType(type)
  }

  return (
    <DateRangePicker
      triggerButton={({ range }) => <DatePickerTriggerButton label={dateType} range={range} />}
      header={() => <DatePickerHeader dateType={dateType} onDateTypeChange={handleDateTypeChange} />}
      footer={(slotProps) => <DatePickerFooter {...slotProps} />}
    />
  )
}