import { useState } from 'react'
import styled from '@emotion/styled'
import { ChevronLeft } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Calendar } from '../ui/calendar'
import { he } from 'date-fns/locale'
import DeadlineTag, { type DeadlineType, DEADLINE_LABELS } from '../shared/DeadlineTag'

// ─── Types ──────────────────────────────────────────────────────────────────

interface DeadlineCellProps {
  deadlineType: DeadlineType | null
  dueDate: Date | null
  onDeadlineTypeChange: (type: DeadlineType) => void
  onDateChange: (date: Date | null) => void
}

// ─── Constants ──────────────────────────────────────────────────────────────

const DEADLINE_TYPES = Object.keys(DEADLINE_LABELS) as DeadlineType[]

function formatDate(date: Date) {
  const day = date.getDate().toString().padStart(2, '0')
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const year = date.getFullYear().toString().slice(-2)
  return `${day}/${month}/${year}`
}

// ─── Component ──────────────────────────────────────────────────────────────

function DeadlineCell({ deadlineType, dueDate, onDeadlineTypeChange, onDateChange }: DeadlineCellProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [calendarFor, setCalendarFor] = useState<'date' | 'ongoing' | null>(null)

  function handleOptionClick(type: DeadlineType) {
    onDeadlineTypeChange(type)
    if (type === 'date' || type === 'ongoing') {
      setCalendarFor(type)
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
            ) : deadlineType === 'immediate' ? (
              <DeadlineTag $type="immediate">מיידי</DeadlineTag>
            ) : deadlineType === 'ongoing' ? (
              <DisplayRow>
                <DeadlineTag $type="ongoing">שוטף</DeadlineTag>
                {dueDate && <DateText>{formatDate(dueDate)}</DateText>}
              </DisplayRow>
            ) : dueDate ? (
              <DateText>{formatDate(dueDate)}</DateText>
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

                {(type === 'date' || type === 'ongoing') && (
                  <ChevronLeft size={12} />
                )}
              </DeadlineOption>
            ))}
            {calendarFor && (
              <CalendarPanel>
                <Calendar
                  mode="single"
                  locale={he}
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
  outline: ${({ $open }) => ($open ? '1px solid #1677ff' : 'none')};
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
  color: rgba(0, 0, 0, 0.88);
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
  color: rgba(0, 0, 0, 0.65);
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
  color: rgba(0, 0, 0, 0.88);

  &:hover {
    background: rgba(0, 0, 0, 0.04);
  }
`

const DeadlineOptionText = styled.span`
  flex: 1;
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  color: rgba(0, 0, 0, 0.88);
  text-align: start;
`

const CalendarPanel = styled.div`
  position: absolute;
  inset-block-start: 0;
  inset-inline-start: calc(100% + 4px);
  background: white;
  border-radius: 8px;
  box-shadow:
    0px 6px 16px rgba(0, 0, 0, 0.08),
    0px 3px 6px rgba(0, 0, 0, 0.12),
    0px 9px 28px rgba(0, 0, 0, 0.05);
`
