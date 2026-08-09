import styled from "@emotion/styled"
import { Calendar as CalendarIcon, X as ClearIcon } from "lucide-react"
import { useState } from "react"
import { DeadlineType } from "src/api/model"
import { formatDate } from "src/functions/date-utils"
import type { DatePickerValue } from "src/utils/date-utils"
import DatePicker, { CalendarMode } from "../shared/DatePicker"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip"

// ─── Types ───────────────────────────────────────────────────────────────────

interface DeadlineFieldProps {
	deadlineType: DeadlineType
	dueDate: Date | null
	onDeadlineTypeChange: (type: DeadlineType) => void
	onDateChange: (date: Date | null) => void
	isEditMode?: boolean
	immediateDate?: Date | null
}

// ─── Component ───────────────────────────────────────────────────────────────

function DeadlineField({
	deadlineType,
	dueDate,
	onDeadlineTypeChange,
	onDateChange,
	isEditMode = false,
	immediateDate = null,
}: DeadlineFieldProps) {
	const [isDateOpen, setIsDateOpen] = useState(false)

	function handleDateSelect(value: DatePickerValue | undefined) {
		const date = value instanceof Date ? value : undefined
		onDateChange(date ?? null)
		setIsDateOpen(false)
	}

	function handleClearDate(e: React.MouseEvent) {
		e.stopPropagation()
		onDateChange(null)
	}

	const showDatePicker = deadlineType !== DeadlineType.IMMEDIATE
	const showImmediateDate =
		deadlineType === DeadlineType.IMMEDIATE && isEditMode

	return (
		<FormItem>
			<FormLabelRow>
				<LabelText>{`תג"ב`}</LabelText>
			</FormLabelRow>
			<DeadlineRow>
				<SegmentedControl>
					<SegmentedItem
						$selected={deadlineType === DeadlineType.DATE}
						onClick={() => onDeadlineTypeChange(DeadlineType.DATE)}
					>
						תאריך
					</SegmentedItem>
					<SegmentedItem
						$selected={deadlineType === DeadlineType.IMMEDIATE}
						onClick={() => onDeadlineTypeChange(DeadlineType.IMMEDIATE)}
					>
						מיידי
					</SegmentedItem>
					<SegmentedItem
						$selected={deadlineType === DeadlineType.ROLLING}
						onClick={() => onDeadlineTypeChange(DeadlineType.ROLLING)}
					>
						שוטף
					</SegmentedItem>
				</SegmentedControl>
				{deadlineType === DeadlineType.IMMEDIATE && (
					<HintText>לביצוע בהקדם</HintText>
				)}
				{deadlineType === DeadlineType.ROLLING && (
					<HintText>עד (אופציונלי)</HintText>
				)}
				{showDatePicker && (
					<Popover open={isDateOpen} onOpenChange={setIsDateOpen}>
						<PopoverTrigger asChild>
							<DatePickerButton>
								<DatePickerText $hasValue={!!dueDate}>
									{dueDate ? formatDate(dueDate) : "בחר תאריך"}
								</DatePickerText>
								{dueDate ? (
									<ClearButton onClick={handleClearDate}>
										<ClearIcon size={14} />
									</ClearButton>
								) : (
									<CalendarIcon size={18} />
								)}
							</DatePickerButton>
						</PopoverTrigger>
						<DatePopoverContent align="start" sideOffset={4}>
							<DatePicker
								mode={CalendarMode.Single}
								selected={dueDate ?? undefined}
								onSelect={handleDateSelect}
								showWeekNumber={false}
							/>
						</DatePopoverContent>
					</Popover>
				)}
				{showImmediateDate && immediateDate && (
					<Tooltip>
						<TooltipTrigger asChild>
							<ImmediateDateText>
								({formatDate(immediateDate)})
							</ImmediateDateText>
						</TooltipTrigger>
						<TooltipContent>תאריך מתן הנחיה</TooltipContent>
					</Tooltip>
				)}
			</DeadlineRow>
		</FormItem>
	)
}

export default DeadlineField

// ─── Styled ──────────────────────────────────────────────────────────────────

const FormItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  width: 100%;
`

const FormLabelRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 4px;
  padding-block-end: 8px;
  font-weight: 400;
  font-size: var(--fs-btn);
  line-height: 22px;
  white-space: nowrap;
`

const LabelText = styled.span`
  color: rgba(0, 0, 0, 0.88);
`

const DeadlineRow = styled.div`
  direction: rtl;
  display: flex;
  align-items: center;
  gap: 16px;
  width: 100%;
`

const SegmentedControl = styled.div`
  display: flex;
  align-items: center;
  height: 40px;
  padding: 2px;
  background: var(--colors-base-neutral-3);
  border-radius: 8px;
  overflow: hidden;
`

const SegmentedItem = styled.button<{ $selected: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  height: 100%;
  padding-inline: 12px;
  border: none;
  border-radius: 6px;
  font-size: var(--fs-btn);
  font-weight: 400;
  line-height: 24px;
  white-space: nowrap;
  cursor: pointer;
  transition: background 0.15s, box-shadow 0.15s;
  background: ${({ $selected }) => ($selected ? "white" : "transparent")};
  color: ${({ $selected }) => ($selected ? "rgba(0, 0, 0, 0.88)" : "rgba(0, 0, 0, 0.65)")};
  box-shadow: ${({ $selected }) =>
		$selected
			? "0px 1px 2px rgba(0, 0, 0, 0.03), 0px 1px 6px -1px rgba(0, 0, 0, 0.02), 0px 2px 4px rgba(0, 0, 0, 0.02)"
			: "none"};

  &:hover {
    background: ${({ $selected }) => ($selected ? "white" : "rgba(0, 0, 0, 0.06)")};
  }
`

const HintText = styled.span`
  font-size: var(--fs-base);
  font-weight: 400;
  line-height: 24px;
  color: rgba(0, 0, 0, 0.65);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const ImmediateDateText = styled.span`
  font-size: var(--fs-base);
  font-weight: 400;
  line-height: 24px;
  color: var(--Text-color-text-placeholder);
  white-space: nowrap;
  cursor: default;
`

const DatePickerButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 4px;
  width: 160px;
  height: 40px;
  padding-inline: 12px;
  background: white;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  color: rgba(0, 0, 0, 0.45);
  flex-shrink: 0;

  &:hover:not(:disabled) {
    border-color: #4096ff;
  }

  &:disabled {
    cursor: not-allowed;
    background: var(--background-area);
    color: var(--Text-color-text-placeholder);
  }
`

const ClearButton = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-color-400);
  flex-shrink: 0;

  &:hover {
    color: var(--text-color-2);
  }
`

const DatePickerText = styled.span<{ $hasValue: boolean }>`
  flex: auto;
  text-align: right;
  font-size: var(--fs-btn);
  font-weight: 400;
  line-height: 24px;
  color: ${({ $hasValue }) => ($hasValue ? "rgba(0, 0, 0, 0.88)" : "rgba(0, 0, 0, 0.25)")};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const DatePopoverContent = styled(PopoverContent)`
  width: auto;
  padding: 0;
  z-index: var(--z-dropdown);
`
