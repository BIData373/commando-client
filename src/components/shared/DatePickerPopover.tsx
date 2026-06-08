import styled from "@emotion/styled"
import { Popover } from "radix-ui"
import type { ReactNode } from "react"
import { useEffect, useState } from "react"
import type { DatePickerValue } from "src/utils/date-utils"
import DatePicker, { type CalendarMode } from "./DatePicker"

// ─── Types ──────────────────────────────────────────────────────────────────

export interface DatePickerSlotProps {
	value: DatePickerValue | undefined
	onChange: (value: DatePickerValue | undefined) => void
	onClose: () => void
}

interface DatePickerPopoverProps {
	mode: CalendarMode
	triggerButton: (props: DatePickerSlotProps) => ReactNode
	header?: (props: DatePickerSlotProps) => ReactNode
	footer?: (props: DatePickerSlotProps) => ReactNode
	open?: boolean
	value?: DatePickerValue
	align?: "start" | "center" | "end"
	side?: "top" | "right" | "bottom" | "left"
	sideOffset?: number
}

// ─── Component ──────────────────────────────────────────────────────────────

function DatePickerPopover({
	mode,
	triggerButton,
	header,
	footer,
	open: controlledOpen,
	value: initialValue,
	align = "end",
	side,
	sideOffset = 8,
}: DatePickerPopoverProps) {
	const [uncontrolledOpen, setUncontrolledOpen] = useState(false)
	const [value, setValue] = useState<DatePickerValue | undefined>(initialValue)

	useEffect(() => {
		setValue(initialValue)
	}, [initialValue])

	const open = controlledOpen ?? uncontrolledOpen

	const slotProps: DatePickerSlotProps = {
		value,
		onChange: setValue,
		onClose: () => setUncontrolledOpen(false),
	}

	return (
		<Popover.Root open={open} onOpenChange={setUncontrolledOpen}>
			<Popover.Trigger asChild>{triggerButton(slotProps)}</Popover.Trigger>
			<Popover.Portal>
				<PopoverContent
					data-lang="he"
					align={align}
					side={side}
					sideOffset={sideOffset}
				>
					{header?.(slotProps)}
					<DatePicker mode={mode} selected={value} onSelect={setValue} />
					{footer?.(slotProps)}
				</PopoverContent>
			</Popover.Portal>
		</Popover.Root>
	)
}

export default DatePickerPopover

// ─── Styled ─────────────────────────────────────────────────────────────────

const PopoverContent = styled(Popover.Content)`
  background: var(--background);
  border: 1px solid var(--line);
  border-radius: 12px;
  padding: 16px;
  box-shadow: var(--shadow-popover);
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 340px;
  z-index: var(--z-dropdown);
`
