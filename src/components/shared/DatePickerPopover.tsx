import styled from "@emotion/styled"
import { Popover } from "radix-ui"
import type { ReactNode } from "react"
import { useState } from "react"
import type { DateRange } from "react-day-picker"
import { RangeContextProvider } from "src/providers/RangeProvider"
import DatePicker, { CalendarMode } from "./DatePicker"

type DatePickerValue = Date | DateRange | undefined

export interface DatePickerSlotProps {
	value: DatePickerValue
	onChange: (value: DatePickerValue) => void
	onClose: () => void
}

interface DatePickerPopoverProps {
	mode: CalendarMode
	triggerButton: (props: DatePickerSlotProps) => ReactNode
	header?: (props: DatePickerSlotProps) => ReactNode
	footer?: (props: DatePickerSlotProps) => ReactNode
}

function DatePickerPopover({
	mode,
	triggerButton,
	header,
	footer,
}: DatePickerPopoverProps) {
	const [open, setOpen] = useState(false)
	const [value, setValue] = useState<DatePickerValue>(undefined)

	const slotProps: DatePickerSlotProps = {
		value,
		onChange: setValue,
		onClose: () => setOpen(false),
	}

	const range =
		mode === CalendarMode.Range ? (value as DateRange | undefined) : undefined

	return (
		<RangeContextProvider range={range}>
			<Popover.Root open={open} onOpenChange={setOpen}>
				{triggerButton(slotProps)}

				<Popover.Portal>
					<PopupContent data-lang="he" align="end" sideOffset={8}>
						{header?.(slotProps)}

						{mode === CalendarMode.Range ? (
							<DatePicker
								mode="range"
								selected={value as DateRange | undefined}
								onSelect={setValue}
							/>
						) : (
							<DatePicker
								mode="single"
								selected={value as Date | undefined}
								onSelect={setValue}
							/>
						)}

						{footer?.(slotProps)}
					</PopupContent>
				</Popover.Portal>
			</Popover.Root>
		</RangeContextProvider>
	)
}

export default DatePickerPopover

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
