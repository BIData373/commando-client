import styled from "@emotion/styled"
import type React from "react"
import { he as heDayPicker } from "react-day-picker/locale"
import type { DatePickerValue } from "src/utils/date-utils"
import { Calendar } from "../ui/calendar"
import CalendarNav from "./CalendarNav"
import { WeekNumberCell } from "./WeekNumberCell"

export enum CalendarMode {
	Range = "range",
	Single = "single",
}

interface DatePickerProps {
	mode: CalendarMode
	selected?: DatePickerValue
	onSelect?: (val: DatePickerValue | undefined) => void
	showWeekNumber?: boolean
}

function DatePicker({
	mode,
	selected,
	onSelect,
	showWeekNumber = true,
}: DatePickerProps) {
	const defaultMonth =
		mode === CalendarMode.Range
			? selected && "from" in selected
				? selected.from
				: undefined
			: selected instanceof Date
				? selected
				: undefined

	return (
		<StyledCalendar
			showWeekNumber={showWeekNumber}
			fixedWeeks
			defaultMonth={defaultMonth}
			{...({ mode, selected, onSelect } as React.ComponentProps<
				typeof Calendar
			>)}
			locale={heDayPicker}
			components={{
				WeekNumber: (props) => (
					<WeekNumberCell {...props} date={selected} onClickBadge={onSelect} />
				),
				Nav: CalendarNav,
			}}
		/>
	)
}

export default DatePicker

const StyledCalendar = styled(Calendar)`
  width: 100%;
  min-height: 0;
  background: var(--background);
  border: 1px solid var(--line);
  border-radius: 8px;

  /* ── Hide default caption (rendered inside custom Nav) ── */
  .rdp-month_caption {
    display: none;
  }
  .rdp-months {
    flex-direction: column;
  }
  /* ── Override nav positioning (custom Nav handles layout) ── */
  .rdp-nav {
    position: static;
  }

  /* ── Weekday headers ── */
  .rdp-weekdays .rdp-weekday {
    font-size: var(--fs-btn);
    color: rgba(0, 0, 0, 0.88) !important;
  }

  /* ── Day cells ── */
  .rdp-day {
    height: 30px;

    button {
      width: 24px;
      height: 24px;
      min-width: 24px;
      font-size: var(--fs-btn);
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
  }

  /* ── Today: purple border, no background (only when not in a range) ── */
  .rdp-today:not(.rdp-range_start):not(.rdp-range_end):not(.rdp-range_middle) {
    background: transparent !important;
    --muted: transparent;
  }

  .rdp-today:not(.rdp-range_start):not(.rdp-range_end):not(.rdp-range_middle)
    button {
    border: 1px solid var(--primary);
    color: rgba(0, 0, 0, 0.88) !important;
  }

  /* ── Selected single: purple bg, white text ── */
  .rdp-day button[data-selected-single="true"] {
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

  /* ── Light-purple band for range cells ── */
  .rdp-range_start,
  .rdp-range_end {
    background-color: #e6e5ff !important;
  }

  .rdp-range_start::after,
  .rdp-range_end::after {
    background-color: #e6e5ff !important;
  }

  .rdp-range_middle {
    background-color: #e6e5ff !important;
    border-radius: 0 !important;
  }

  .rdp-day button[data-range-middle="true"] {
    background: transparent !important;
    color: rgba(0, 0, 0, 0.88) !important;
  }

  /* ── Range start/end: purple circle ── */
  .rdp-day button[data-range-start="true"],
  .rdp-day button[data-range-end="true"] {
    background: var(--primary) !important;
    color: white !important;
    border-radius: 6px !important;
    width: 24px !important;
    height: 24px !important;
    min-width: 24px !important;
  }
`
