import styled from '@emotion/styled'
import { Popover } from 'radix-ui'
import type { ReactNode } from 'react'
import { useState } from 'react'
import type { DateRange } from 'react-day-picker'
import { he as heDayPicker } from 'react-day-picker/locale'
import { RangeContext, WeekNumberCell } from '#/providers/RangeProvider'
import { Calendar } from '../ui/calendar'


export interface DateRangePickerSlotProps {
  range: DateRange | undefined
  onRangeChange: (range: DateRange | undefined) => void
  onClose: () => void
}

interface DateRangePickerProps {
  triggerButton: (props: DateRangePickerSlotProps) => ReactNode
  header?: (props: DateRangePickerSlotProps) => ReactNode
  footer?: (props: DateRangePickerSlotProps) => ReactNode
}

interface PickerState {
  open: boolean
  range: DateRange | undefined
}

function DateRangePicker({ triggerButton, header, footer }: DateRangePickerProps) {
  const [state, setState] = useState<PickerState>({
    open: false,
    range: undefined,
  })

  function setField<K extends keyof PickerState>(key: K, value: PickerState[K]) {
    setState((prev) => ({ ...prev, [key]: value }))
  }

  function handleOpenChange(open: boolean) {
    setField('open', open)
  }

  function handleRangeSelect(range: DateRange | undefined) {
    setField('range', range)
  }

  function handleClose() {
    setField('open', false)
  }

  const slotProps: DateRangePickerSlotProps = {
    range: state.range,
    onRangeChange: handleRangeSelect,
    onClose: handleClose,
  }

  return (
    <RangeContext.Provider value={state.range}>
      <Popover.Root open={state.open} onOpenChange={handleOpenChange}>
        {triggerButton(slotProps)}
        <Popover.Portal>
          <PopupContent data-lang="he" align="end" sideOffset={8}>
            {header?.(slotProps)}
            <StyledCalendar
              showWeekNumber
              mode="range"
              selected={state.range}
              onSelect={handleRangeSelect}
              locale={heDayPicker}
              components={{ WeekNumber: WeekNumberCell }}
            />
            {footer?.(slotProps)}
          </PopupContent>
        </Popover.Portal>
      </Popover.Root>
    </RangeContext.Provider>
  )
}

export default DateRangePicker

const PopupContent = styled(Popover.Content)`
  background: var(--background);
  border: 1px solid var(--line);
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 340px;
`

const StyledCalendar = styled(Calendar)`
  width: 100%;
  min-height: 0;
  box-shadow: 0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05);

  td {
    display: flex;
    align-items: center;
    justify-content: center;

    button[data-range-start=true],
    button[data-range-end=true] {
      width: 15px;
    }
  }
`