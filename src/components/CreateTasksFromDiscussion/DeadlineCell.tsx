import styled from "@emotion/styled"
import { ChevronLeft } from "lucide-react"
import { useState } from "react"
import { DeadlineType } from "src/api/model"
import { formatDateShort } from "../../functions/date-utils"
import type { DatePickerValue } from "../shared/DatePicker"
import { CalendarMode } from "../shared/DatePicker"
import DatePickerPopover from "../shared/DatePickerPopover"
import DeadlineTag, {
  DEADLINE_LABELS,
} from "../shared/DeadlineTag"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"

// ─── Types ──────────────────────────────────────────────────────────────────

interface DeadlineCellProps {
  deadlineType: DeadlineType | null
  dueDate?: Date | null
  onDeadlineTypeChange: (type: DeadlineType) => void
  onDateChange: (date: Date | null) => void
}

// ─── Constants ──────────────────────────────────────────────────────────────

const DEADLINE_TYPES = Object.keys(DEADLINE_LABELS) as DeadlineType[]
const TYPES_WITH_CALENDAR: DeadlineType[] = [
  DeadlineType.DATE,
  DeadlineType.ROLLING,
]
export const DATA_CELL_ACTIVE_KEY = "data-cell-active"

// ─── Component ──────────────────────────────────────────────────────────────

function DeadlineCell({
  deadlineType,
  dueDate,
  onDeadlineTypeChange,
  onDateChange,
}: DeadlineCellProps) {
  const [isOpen, setIsOpen] = useState(false)

  function handleOptionClick(type: DeadlineType) {
    onDeadlineTypeChange(type)
    if (!TYPES_WITH_CALENDAR.includes(type)) {
      setIsOpen(false)
    }
  }

  function handleSetDate(value: DatePickerValue | undefined) {
    const date = value instanceof Date ? value : undefined
    onDateChange(date ?? null)
    setIsOpen(false)
  }

  function handleSetWithoutDate() {
    onDateChange(null)
    setIsOpen(false)
  }

  return (
    <DeadlineCellWrapper {...{ [DATA_CELL_ACTIVE_KEY]: isOpen || undefined }}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <DeadlineTrigger>
            {!deadlineType ? (
              <PlaceholderText>{`תג"ב`}</PlaceholderText>
            ) : deadlineType === DeadlineType.IMMEDIATE ? (
              <DeadlineTag $type={DeadlineType.IMMEDIATE}>
                {DEADLINE_LABELS[DeadlineType.IMMEDIATE]}
              </DeadlineTag>
            ) : deadlineType === DeadlineType.ROLLING ? (
              <DisplayRow>
                <DeadlineTag $type={DeadlineType.ROLLING}>
                  {DEADLINE_LABELS[DeadlineType.ROLLING]}
                </DeadlineTag>
                {dueDate && <DateText>{formatDateShort(dueDate)}</DateText>}
              </DisplayRow>
            ) : dueDate ? (
              <DateText>{formatDateShort(dueDate)}</DateText>
            ) : (
              <PlaceholderText>{`תג"ב`}</PlaceholderText>
            )}
          </DeadlineTrigger>
        </PopoverTrigger>
        <DeadlineDropdownContent sideOffset={4}>
          <DropdownRow>
            <DropdownHeader>{`תג"ב`}</DropdownHeader>
            {DEADLINE_TYPES.map((type) => (
              <DeadlineOption
                key={type}
                $active={deadlineType === type}
                onClick={() => handleOptionClick(type)}
              >
                <DeadlineOptionText>{DEADLINE_LABELS[type]}</DeadlineOptionText>

                {TYPES_WITH_CALENDAR.includes(type) && (
                  <ChevronLeft size={12} />
                )}
              </DeadlineOption>
            ))}
            <DatePickerPopover
              mode={CalendarMode.Single}
              open={
                deadlineType === DeadlineType.DATE ||
                deadlineType === DeadlineType.ROLLING
              }
              value={dueDate ?? undefined}
              side="left"
              sideOffset={12}
              align="start"
              triggerButton={() => <HiddenAnchor />}
              header={() => (
                <PopoverHeaderText>
                  {deadlineType === DeadlineType.ROLLING
                    ? "עד (אופציונלי)"
                    : "בחר תאריך להנחיה"}
                </PopoverHeaderText>
              )}
              footer={({ value }) => (
                <PopoverFooter>
                  <SetButton onClick={() => handleSetDate(value)}>
                    הגדר
                  </SetButton>
                  {deadlineType === DeadlineType.ROLLING && (
                    <SetWithoutDateButton onClick={handleSetWithoutDate}>
                      הגדר ללא תאריך
                    </SetWithoutDateButton>
                  )}
                </PopoverFooter>
              )}
            />
          </DropdownRow>
        </DeadlineDropdownContent>
      </Popover>
    </DeadlineCellWrapper>
  )
}

export default DeadlineCell

// ─── Styled ─────────────────────────────────────────────────────────────────

const DeadlineCellWrapper = styled.div`
  direction: rtl;
  display: flex;
  align-items: center;
  height: 100%;
  background: transparent;
  z-index: var(--z-dropdown);
`

const DeadlineTrigger = styled.button`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  height: 100%;
  padding-inline: 0;
  background: transparent;
  cursor: pointer;
  outline: none;
`

const PlaceholderText = styled.span`
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  color:  var(--Components-Dropdown-Global-colorTextDescription);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const DisplayRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`

const DateText = styled.span`
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  color: var(--text-color);
  white-space: nowrap;
`

const DeadlineDropdownContent = styled(PopoverContent)`
  width:138px !important;
  min-width: 0 !important;
  padding: 4px;
  overflow: visible;
  z-index: var(--z-dropdown);
`

const DropdownRow = styled.div`
  position: relative;
`

const DropdownHeader = styled.div`
  display: flex;
  align-items: center;
  height: 32px;
  padding-inline: 12px;
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  color: var(--Components-Dropdown-Global-colorTextDescription);
`

const DeadlineOption = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  height: 32px;
  padding-inline: 12px;
  background: ${({ $active }) => ($active ? "var(--Components-Dropdown-Global-controlItemBgHover)" : "transparent")};
  border-radius: 4px;
  cursor: pointer;
  color: var(--text-color-2);

  &:hover {
    background: var(--Components-Dropdown-Global-controlItemBgHover);
  }
`

const DeadlineOptionText = styled.span`
  flex: 1;
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  color: var(--text-color-2);
  text-align: start;
`

const HiddenAnchor = styled.div`
  position: absolute;
  inset-block-start: 0;
  inset-inline-end: 0;
`

const PopoverHeaderText = styled.span`
  direction: ltr;
  font-size: 14px;
  font-weight: 500;
  line-height: 22px;
  color: var(--text-color-2);
  text-align: end;
`

const PopoverFooter = styled.div`
  direction: ltr;
  display: flex;
  gap: 8px;
`

const SetButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 32px;
  padding-inline: 15px;
  border: 1px solid var(--primary);
  border-radius: 6px;
  background: var(--default-linear);
  color: var(--background);
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  cursor: pointer;
  white-space: nowrap;
`

const SetWithoutDateButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 32px;
  padding-inline: 16px;
  border: 1px solid var(--primary);
  border-radius: 6px;
  background: var(--background);
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  cursor: pointer;
  white-space: nowrap;
  background-image: var(--default-linear);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`
