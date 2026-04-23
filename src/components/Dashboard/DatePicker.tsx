import styled from '@emotion/styled'
import { format } from 'date-fns'
import { CalendarDays, ChevronDown } from 'lucide-react'
import { Popover } from 'radix-ui'
import { useState } from 'react'
import DateRangePicker from './DateRangePicker'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu'
import type { DateRangePickerSlotProps } from "./DateRangePicker"
import type { DateRange } from 'react-day-picker'

const DATE_TYPES = [
    'תאריך יצירה',
    'לפי ת"ג',
    'תאריך מתן הנחייה',
    'תאריך עדכון',
    'תאריך סיום',
] as const


interface PickerHeaderProps {
    dateType: string
    onDateTypeChange: (type: string) => void
}

function DatePickerHeader({ dateType, onDateTypeChange }: PickerHeaderProps) {
    return (
        <PopupHeader>
            <FilterLabel>סנן לפי:</FilterLabel>
            <DropdownMenu>
                <DateTypeTrigger>
                    {dateType}
                    <ChevronDown size={16} />
                </DateTypeTrigger>
                <DropdownMenuContent align="end">
                    {DATE_TYPES.map((type) => (
                        <DropdownMenuItem key={type} onSelect={() => onDateTypeChange(type)}>
                            {type}
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
        </PopupHeader>
    )
}

function DatePickerFooter({ onRangeChange, onClose }: DateRangePickerSlotProps) {
    function handleClear() {
        onRangeChange(undefined)
    }

    function handleConfirm() {
        onClose()
    }

    return (
        <PopupFooter>
            <ClearButton onClick={handleClear}>נקה בחירה</ClearButton>
            <ConfirmButton onClick={handleConfirm}>אישור</ConfirmButton>
        </PopupFooter>
    )
}

interface TriggerButtonProps {
    label: string
    range: DateRange | undefined
}

function DateRangeLabel({ label, range }: TriggerButtonProps) {
    return (
        <>
            {label && range?.from && range.to ? (
                <span>
                    {label}:{" "}{format(range.from, "dd")}-{format(range.to, "dd/MM/y")}
                </span>
            ) : (
                <span>טווח תאריכים</span>
            )}
        </>
    )
}

function DatePickerTriggerButton({ label, range }: TriggerButtonProps) {
    return (
        <Popover.Trigger asChild>
            <TriggerButton>
                <CalendarDays size={16} />
                <DateRangeLabel label={label} range={range} />
                <ChevronDown size={16} />
            </TriggerButton>
        </Popover.Trigger>
    )
}

export function DatePicker() {
    const [dateType, setDateType] = useState<string>(DATE_TYPES[0])

    function handleDateTypeChange(type: string) {
        setDateType(type)
    }

    function renderPickerHeader(_slotsProps: DateRangePickerSlotProps) {
        return <DatePickerHeader dateType={dateType} onDateTypeChange={handleDateTypeChange} />
    }

    function renderPickerFooter(slotProps: DateRangePickerSlotProps) {
        return <DatePickerFooter {...slotProps} />
    }

    function renderTriggerButton(slotProps: DateRangePickerSlotProps) {
        return <DatePickerTriggerButton label={dateType} range={slotProps.range} />
    }

    return (
        <DateRangePicker
            triggerButton={renderTriggerButton}
            header={renderPickerHeader}
            footer={renderPickerFooter}
        />
    )
}

const TriggerButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 32px;
  padding: 0 15px;
  border: 1px solid var(--purple-start);
  color:var(--purple-start);
  border-radius: 8px;
  background: var(--background);
  font-size: 12px;
  font-weight: 400;
  cursor: pointer;
  white-space: nowrap;
  align-self: flex-end;
  transition: opacity 0.15s;

  & > * {
    background: var(--purple-start);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  &:hover {
    opacity: 0.8;
  }
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


const PopupHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const PopupFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-block-start: 4px;
`