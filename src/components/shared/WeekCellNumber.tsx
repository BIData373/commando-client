import styled from '@emotion/styled'
import { useContext } from 'react'
import type { DateRange, WeekNumberProps } from 'react-day-picker'
import { RangeContext } from '#/providers/RangeProvider'


function isFullWeekSelected(week: WeekNumberProps['week'], range: DateRange | undefined): boolean {
    if (!range?.from || !range?.to) return false
    const firstDay = week.days[0].date
    const lastDay = week.days[week.days.length - 1].date
    return firstDay >= range.from && lastDay <= range.to
}

export function WeekNumberCell({ week, ...props }: WeekNumberProps) {
    const range = useContext(RangeContext)
    const selected = isFullWeekSelected(week, range)
    return (
        <WeekNumber {...props}>
            <WeekNumberBadge $selected={selected}>
                {week.weekNumber}
            </WeekNumberBadge>
        </WeekNumber>
    )
}

const WeekNumber = styled.td`
  display: flex;
  align-items: center;
`

const WeekNumberBadge = styled.div<{ $selected: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 20px;
  height: 20px;
  border-radius: 5px;
  font-size: 10px;
  margin-left: 2px;
  color: ${({ $selected }) => $selected ? 'var(--primary-foreground)' : 'var(--muted-foreground)'};
  background: ${({ $selected }) => $selected ? 'var(--primary)' : 'transparent'};
`