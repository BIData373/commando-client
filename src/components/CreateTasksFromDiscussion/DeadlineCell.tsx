import { useState } from 'react'
import styled from '@emotion/styled'
import { ChevronLeft } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import DatePicker, { CalendarMode } from '../shared/DatePicker'
import DeadlineTag, { DeadlineType, DEADLINE_LABELS } from '../shared/DeadlineTag'
import { formatDateShort } from '../../functions/date-utils'

// ─── Types ──────────────────────────────────────────────────────────────────

interface DeadlineCellProps {
  deadlineType: DeadlineType | null
  dueDate: Date | null
  onDeadlineTypeChange: (type: DeadlineType) => void
  onDateChange: (date: Date | null) => void
}

// ─── Constants ──────────────────────────────────────────────────────────────

const DEADLINE_TYPES = Object.keys(DEADLINE_LABELS) as DeadlineType[]
const TYPES_WITH_CALENDAR: DeadlineType[] = [DeadlineType.Date, DeadlineType.Ongoing]


// ─── Component ──────────────────────────────────────────────────────────────

function DeadlineCell({ deadlineType, dueDate, onDeadlineTypeChange, onDateChange }: DeadlineCellProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [calendarFor, setCalendarFor] = useState<DeadlineType.Date | DeadlineType.Ongoing | null>(null)

  function handleOptionClick(type: DeadlineType) {
    onDeadlineTypeChange(type)
    if (TYPES_WITH_CALENDAR.includes(type)) {
      setCalendarFor(type as DeadlineType.Date | DeadlineType.Ongoing)
    } else {
      setCalendarFor(null)
      setIsOpen(false)
    }
  }

  function handleDateSelect(date: Date | undefined) {
    onDateChange(date ?? null)
    setCalendarFor(null)
    setIsOpen(false)
  }

  function handleOpenChange(open: boolean) {
    setIsOpen(open)
    if (!open) setCalendarFor(null)
  }

  return (
    <DeadlineCellWrapper $open={isOpen}>
      <Popover open={isOpen} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>
          <DeadlineTrigger>
            {!deadlineType ? (
              <PlaceholderText>תג&quot;ב</PlaceholderText>
            ) : deadlineType === DeadlineType.Immediate ? (
              <DeadlineTag $type={DeadlineType.Immediate}>מיידי</DeadlineTag>
            ) : deadlineType === DeadlineType.Ongoing ? (
              <DisplayRow>
                <DeadlineTag $type={DeadlineType.Ongoing}>שוטף</DeadlineTag>
                {dueDate && <DateText>{formatDateShort(dueDate)}</DateText>}
              </DisplayRow>
            ) : dueDate ? (
              <DateText>{formatDateShort(dueDate)}</DateText>
            ) : (
              <DeadlineValueText>
                {DEADLINE_LABELS[deadlineType]}
              </DeadlineValueText>
            )}
          </DeadlineTrigger>
        </PopoverTrigger>
        <DeadlineDropdownContent sideOffset={1}>
          <DropdownRow>
            <DropdownHeader>תג&quot;ב</DropdownHeader>
            {DEADLINE_TYPES.map((type) => (
              <DeadlineOption
                key={type}
                $active={calendarFor === type}
                onClick={() => handleOptionClick(type)}
              >
                <DeadlineOptionText>{DEADLINE_LABELS[type]}</DeadlineOptionText>

                {TYPES_WITH_CALENDAR.includes(type) && (
                  <ChevronLeft size={12} />
                )}
              </DeadlineOption>
            ))}
            {calendarFor && (
              <CalendarPanel>
                <DatePicker
                  mode={CalendarMode.Single}
                  selected={dueDate ?? undefined}
                  onSelect={handleDateSelect}
                />
              </CalendarPanel>
            )}
          </DropdownRow>
        </DeadlineDropdownContent>
      </Popover>
    </DeadlineCellWrapper>
  )
}

export default DeadlineCell

// ─── Styled ─────────────────────────────────────────────────────────────────

const DeadlineCellWrapper = styled.div<{ $open: boolean }>`
  direction: rtl;
  display: flex;
  align-items: center;
  height: 100%;
  margin: 0 -12px;
  padding: 0 12px;
  background: transparent;
  outline: ${({ $open }) => ($open ? '1px solid var(--tab-active-color)' : 'none')};
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
  color: rgba(0, 0, 0, 0.25);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const DeadlineValueText = styled.span`
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  color: var(--text-color-2);
  white-space: nowrap;
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
  color: rgba(0, 0, 0, 0.45);
`

const DeadlineOption = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  height: 32px;
  padding-inline: 12px;
  background: ${({ $active }) => ($active ? 'rgba(0, 0, 0, 0.04)' : 'transparent')};
  border-radius: 4px;
  cursor: pointer;
  color: var(--text-color-2);

  &:hover {
    background: rgba(0, 0, 0, 0.04);
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

const CalendarPanel = styled.div`
  position: absolute;
  inset-block-start: 0;
  inset-inline-start: calc(100% + 4px);
  background: var(--background);
  border-radius: 8px;
  box-shadow: var(--card-shadow);
`
