import styled from '@emotion/styled'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'
import { useDayPicker } from 'react-day-picker'

function CalendarNav() {
  const { months, goToMonth, nextMonth, previousMonth } = useDayPicker()
  const currentMonth = months[0]?.date

  const handlePreviousYear = () => {
    if (!currentMonth) return
    const prev = new Date(currentMonth)
    prev.setFullYear(prev.getFullYear() - 1)
    goToMonth(prev)
  }

  const handleNextYear = () => {
    if (!currentMonth) return
    const next = new Date(currentMonth)
    next.setFullYear(next.getFullYear() + 1)
    goToMonth(next)
  }

  const handlePreviousMonth = () => {
    if (previousMonth) goToMonth(previousMonth)
  }

  const handleNextMonth = () => {
    if (nextMonth) goToMonth(nextMonth)
  }

  const monthLabel = currentMonth
    ? currentMonth.toLocaleDateString('he', { month: 'long', year: 'numeric' })
    : ''

  return (
    <NavContainer>
      <NavGroup>
        <NavButton onClick={handleNextYear}>
          <ChevronsLeft size={16} />
        </NavButton>
        <NavButton onClick={handleNextMonth}>
          <ChevronLeft size={16} />
        </NavButton>
      </NavGroup>
      <MonthLabel>{monthLabel}</MonthLabel>
      <NavGroup>
        <NavButton onClick={handlePreviousMonth}>
          <ChevronRight size={16} />
        </NavButton>
        <NavButton onClick={handlePreviousYear}>
          <ChevronsRight size={16} />
        </NavButton>
      </NavGroup>
    </NavContainer>
  )
}

export default CalendarNav

const NavContainer = styled.div`
  direction: ltr;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 9px 8px;
  border-block-end: 1px solid rgba(0, 0, 0, 0.06);
`

const NavGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`

const NavButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  padding: 0;
  border: none;
  background: transparent;
  color: rgba(0, 0, 0, 0.45);
  cursor: pointer;

  &:hover {
    color: rgba(0, 0, 0, 0.88);
  }
`

const MonthLabel = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.88);
  white-space: nowrap;
`
