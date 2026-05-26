import styled from '@emotion/styled'
import React from 'react'
import type { DateRange } from 'react-day-picker'
import { he as heDayPicker } from 'react-day-picker/locale'
import { Calendar } from '../ui/calendar'
import CalendarNav from './CalendarNav'
import { WeekNumberCell } from './WeekCellNumber'

export enum CalendarMode {
  Range = 'range',
  Single = 'single',
}

export type DatePickerValue = Date | DateRange

interface DatePickerProps {
  mode: CalendarMode
  selected?: DatePickerValue
  onSelect?: (val: DatePickerValue | undefined) => void
}

function getDefaultMonth(props: DatePickerProps): Date | undefined {
  if (props.mode === CalendarMode.Range) {
    return props.selected && 'from' in props.selected ? props.selected.from : undefined
  }
  return props.selected instanceof Date ? props.selected : undefined
}

function DatePicker(props: DatePickerProps) {
  const defaultMonth = getDefaultMonth(props)
  const { mode, selected, onSelect } = props

  return (
    <StyledCalendar
      showWeekNumber
      fixedWeeks
      defaultMonth={defaultMonth}
      {...({ mode, selected, onSelect } as React.ComponentProps<typeof Calendar>)}
      locale={heDayPicker}
      components={{ WeekNumber: WeekNumberCell, Nav: CalendarNav }}
    />
  )
}

export default DatePicker

const StyledCalendar = styled(Calendar)`
  width: 100%;
  min-height: 0;
  background: white;
  border-radius: 8px;
  box-shadow:
    0 6px 16px 0 rgba(0, 0, 0, 0.08),
    0 3px 6px -4px rgba(0, 0, 0, 0.12),
    0 9px 28px 8px rgba(0, 0, 0, 0.05);

  /* ── Hide default caption (rendered inside custom Nav) ── */
  .rdp-month_caption {
    display: none;
  }
  .rdp-months{
    flex-direction: column;
  }
  /* ── Override nav positioning (custom Nav handles layout) ── */
  .rdp-nav {
    position: static;
  }

  /* ── Weekday headers ── */
  .rdp-weekdays .rdp-weekday {
    font-size: 14px;
    color: rgba(0, 0, 0, 0.88) !important;
  }

  /* ── Day cells ── */
  .rdp-day {
    height: 30px;

    button {
      width: 24px;
      height: 24px;
      min-width: 24px;
      font-size: 14px;
      font-weight: 400;
      color: rgba(0, 0, 0, 0.88);
      border-radius: 6px;
      border: none;
    }

    &:hover {
      cursor: pointer;
    }
  }

  td {
    display: flex;
    align-items: center;
    justify-content: center;

    button[data-range-start='true'],
    button[data-range-end='true'] {
      width: 15px;
    }
  }

  /* ── Today: purple border, no background ── */
  .rdp-today {
    background: transparent !important;
    --muted: transparent;

    button {
      border: 1px solid var(--primary);
      color: rgba(0, 0, 0, 0.88) !important;
    }
  }

  /* ── Selected single: purple bg, white text ── */
  .rdp-day button[data-selected-single='true'] {
    background: var(--primary) !important;
    color: white !important;
    border: none !important;
    outline: none !important;
  }

  /* ── Remove focus outline ── */
  .rdp-focused {
    border: none !important;
    outline: none !important;
  }


  /* ── Range start/end ── */
  .rdp-day button[data-range-start='true'],
  .rdp-day button[data-range-end='true'] {
    background: var(--primary) !important;
    color: white !important;
  }

  /* ── Range middle ── */
  .rdp-day button[data-range-middle='true'] {
    color: rgba(0, 0, 0, 0.88) !important;
  }

`

