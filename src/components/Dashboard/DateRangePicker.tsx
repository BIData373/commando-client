import styled from '@emotion/styled'
import { format } from 'date-fns'
import { CalendarDays, ChevronDown } from 'lucide-react'
import { Popover } from 'radix-ui'
import { useState } from 'react'
import type { DateRange } from 'react-day-picker'
import { he as heDayPicker } from 'react-day-picker/locale'
import { Calendar } from '../ui/calendar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'

const DATE_TYPES = [
  'תאריך יצירה',
  'לפי ת"ג',
  'תאריך מתן הנחייה',
  'תאריך עדכון',
  'תאריך סיום',
] as const

interface PickerState {
  open: boolean
  dateType: string | undefined
  range: DateRange | undefined
}

function DateRangePicker() {
  const [state, setState] = useState<PickerState>({
    open: false,
    dateType: undefined,
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

  function handleDateTypeSelect(type: string) {
    setField('dateType', type)
  }

  function handleClear() {
    setField('range', undefined)
  }

  function handleConfirm() {
    setField('open', false)
  }

  return (
    <Popover.Root open={state.open} onOpenChange={handleOpenChange}>
      <Popover.Trigger asChild>
        <TriggerButton>
          <CalendarDays size={18} />
          {state.dateType && state.range?.from && state.range.to ? (
            <span>
              {state.dateType}:{" "}{format(state.range.from, "dd")}-{format(state.range.to, "dd/MM/y")}
            </span>
          ) : (
            <span>טווח תאריכים</span>
          )}
          <ChevronDown size={18} />
        </TriggerButton>
      </Popover.Trigger>
      <Popover.Portal>
        <PopupContent data-lang="he" align="end" sideOffset={8}>
          <PopupHeader>
            <FilterLabel>סנן לפי:</FilterLabel>
            <DropdownMenu>
              <DateTypeTrigger>
                {state.dateType ?? DATE_TYPES[0]}
                <ChevronDown size={14} />
              </DateTypeTrigger>
              <StyledDropdownMenuContent align='end'>
                {DATE_TYPES.map((type) => (
                  <DropdownMenuItem key={type} onSelect={() => handleDateTypeSelect(type)}>
                    {type}
                  </DropdownMenuItem>
                ))}
              </StyledDropdownMenuContent>
            </DropdownMenu>
          </PopupHeader>
          <StyledCalendar
            mode="range"
            selected={state.range}
            onSelect={handleRangeSelect}
            locale={heDayPicker}
          />
          <PopupFooter>
            <ClearButton onClick={handleClear}>נקה בחירה</ClearButton>
            <ConfirmButton onClick={handleConfirm}>אישור</ConfirmButton>
          </PopupFooter>
        </PopupContent>
      </Popover.Portal>
    </Popover.Root>
  )
}

export default DateRangePicker

const TriggerButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 32px;
  padding: 0 15px;
  border: 1px solid var(--purple-start);
  border-radius: 8px;
  background: var(--background);
  font-size: 12px;
  font-weight: 400;
  cursor: pointer;
  white-space: nowrap;
  align-self: flex-end;
  transition: opacity 0.15s;

  & > * {
    background: linear-gradient(150deg, var(--purple-start) 0%, var(--purple-end) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  &:hover {
    opacity: 0.8;
  }
`

const PopupContent = styled(Popover.Content)`
  background: var(--background);
  border: 1px solid var(--line);
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 312px;
`

const StyledDropdownMenuContent = styled(DropdownMenuContent)`
  z-index: 1000;
`

const StyledCalendar = styled(Calendar)`
  width: 100%;
      min-height: 0;
  box-shadow: 0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05);
`

const PopupHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
`

const FilterLabel = styled.span`
  font-size: 14px;
  color: var(--sea-ink-soft);
  white-space: nowrap;
`

const DateTypeTrigger = styled(DropdownMenuTrigger)`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 32px;
  padding: 0 10px;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--background);
  color: var(--sea-ink);
  font-size: 14px;
  cursor: pointer;
  white-space: nowrap;

  &:hover {
    background: var(--chip-bg);
  }
`

const PopupFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-block-start: 4px;
`

const ConfirmButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 36px;
  padding: 0 20px;
  border: none;
  border-radius: 8px;
  background: linear-gradient(165deg, var(--purple-start) 0%, var(--purple-end) 100%);
  color: var(--primary-foreground);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: opacity 0.15s;

  &:hover {
    opacity: 0.9;
  }
`

const ClearButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 36px;
  padding: 0 12px;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: var(--sea-ink-soft);
  font-size: 14px;
  cursor: pointer;
  transition: color 0.15s;

  &:hover {
    color: var(--sea-ink);
  }
`
