import { useState } from 'react'
import styled from '@emotion/styled'
import { Calendar as CalendarIcon } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import DatePicker, { CalendarMode } from '../shared/DatePicker'
import type { DeadlineType } from '../shared/DeadlineTag'

// ─── Types ───────────────────────────────────────────────────────────────────

interface DeadlineFieldProps {
  deadlineType: DeadlineType
  dueDate: Date | null
  onDeadlineTypeChange: (type: DeadlineType) => void
  onDateChange: (date: Date | null) => void
}

// ─── Component ───────────────────────────────────────────────────────────────

function DeadlineField({ deadlineType, dueDate, onDeadlineTypeChange, onDateChange }: DeadlineFieldProps) {
  const [isDateOpen, setIsDateOpen] = useState(false)

  function handleDateSelect(date: Date | undefined) {
    onDateChange(date ?? null)
    setIsDateOpen(false)
  }

  const formatDate = (date: Date) => {
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  }

  const showDatePicker = deadlineType !== 'immediate'

  return (
    <FormItem>
      <FormLabelRow>
        <LabelText>תג&quot;ב</LabelText>
      </FormLabelRow>
      <DeadlineRow>
        <SegmentedControl>
          <SegmentedItem
            $selected={deadlineType === 'date'}
            onClick={() => onDeadlineTypeChange('date')}
          >
            תאריך
          </SegmentedItem>
          <SegmentedItem
            $selected={deadlineType === 'immediate'}
            onClick={() => onDeadlineTypeChange('immediate')}
          >
            מיידי
          </SegmentedItem>
          <SegmentedItem
            $selected={deadlineType === 'ongoing'}
            onClick={() => onDeadlineTypeChange('ongoing')}
          >
            שוטף
          </SegmentedItem>
        </SegmentedControl>
        {deadlineType === 'immediate' && (
          <HintText>לביצוע בהקדם</HintText>
        )}
        {deadlineType === 'ongoing' && (
          <HintText>עד (אופציונלי)</HintText>
        )}
        {showDatePicker && (
          <Popover open={isDateOpen} onOpenChange={setIsDateOpen}>
            <PopoverTrigger asChild>
              <DatePickerButton>
                <DatePickerText $hasValue={!!dueDate}>
                  {dueDate ? formatDate(dueDate) : 'בחר תאריך'}
                </DatePickerText>
                <CalendarIcon size={18} />
              </DatePickerButton>
            </PopoverTrigger>
            <DatePopoverContent align="start" sideOffset={4}>
              <DatePicker
                mode={CalendarMode.Single}
                selected={dueDate ?? undefined}
                onSelect={handleDateSelect}
              />
            </DatePopoverContent>
          </Popover>
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
  font-size: 14px;
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
  background: #f5f5f5;
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
  font-size: 14px;
  font-weight: 400;
  line-height: 24px;
  white-space: nowrap;
  cursor: pointer;
  transition: background 0.15s, box-shadow 0.15s;
  background: ${({ $selected }) => ($selected ? 'white' : 'transparent')};
  color: ${({ $selected }) => ($selected ? 'rgba(0, 0, 0, 0.88)' : 'rgba(0, 0, 0, 0.65)')};
  box-shadow: ${({ $selected }) =>
    $selected
      ? '0px 1px 2px rgba(0, 0, 0, 0.03), 0px 1px 6px -1px rgba(0, 0, 0, 0.02), 0px 2px 4px rgba(0, 0, 0, 0.02)'
      : 'none'};

  &:hover {
    background: ${({ $selected }) => ($selected ? 'white' : 'rgba(0, 0, 0, 0.06)')};
  }
`

const HintText = styled.span`
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  color: rgba(0, 0, 0, 0.65);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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

  &:hover {
    border-color: #4096ff;
  }
`

const DatePickerText = styled.span<{ $hasValue: boolean }>`
  flex: auto;
  text-align: right;
  font-size: 14px;
  font-weight: 400;
  line-height: 24px;
  color: ${({ $hasValue }) => ($hasValue ? 'rgba(0, 0, 0, 0.88)' : 'rgba(0, 0, 0, 0.25)')};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const DatePopoverContent = styled(PopoverContent)`
  width: auto;
  padding: 0;
`
