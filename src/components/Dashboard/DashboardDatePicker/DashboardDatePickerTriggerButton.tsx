import styled from '@emotion/styled'
import { format } from "date-fns"
import { CalendarDays, ChevronDown } from 'lucide-react'
import { Popover } from 'radix-ui'
import type { DateRange } from "react-day-picker"

interface TriggerButtonProps {
    label: string
    range: DateRange | undefined
}

export function DashboardDatePickerTriggerButton({ label, range }: TriggerButtonProps) {
    return (
        <Popover.Trigger asChild>
            <TriggerButton>
                <CalendarDays size={16} />
                {label && range?.from && range.to ? (
                    <RangeLabel>
                        {label}:{" "}{format(range.from, "dd")}-{format(range.to, "dd/MM/y")}
                    </RangeLabel>
                ) : (
                    <RangeLabel>טווח תאריכים</RangeLabel>
                )}
                <ChevronDown size={16} />
            </TriggerButton>
        </Popover.Trigger>
    )
}

const RangeLabel = styled.span`
    font-size: 16px;
`

const TriggerButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  height: 32px;
  padding: 18px 15px;
  border: 1px solid var(--purple-start);
  color:var(--purple-start);
  border-radius: 8px;
  background: var(--background);
  font-size: 16px;
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