import styled from "@emotion/styled"
import { isDateRange, type WeekNumberProps } from "react-day-picker"
import type { DatePickerValue } from "src/utils/date-utils"

interface WeekNumberCellProps extends WeekNumberProps {
	date?: DatePickerValue
	onClickBadge?: (val: DatePickerValue | undefined) => void
}

export function WeekNumberCell({
	week,
	date,
	onClickBadge,
	...props
}: WeekNumberCellProps) {
	const selected =
		isDateRange(date) &&
		!!date?.from &&
		!!date?.to &&
		week.days[0].date >= date.from &&
		week.days[week.days.length - 1].date <= date.to

	function handleClickBadge() {
		onClickBadge?.({
			from: week.days[0].date,
			to: week.days[week.days.length - 1].date,
		})
	}

	return (
		<WeekNumber {...props}>
			<WeekNumberBadge onClick={handleClickBadge} $selected={selected}>
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
  cursor: pointer;
  color: ${({ $selected }) => ($selected ? "var(--primary-foreground)" : "var(--muted-foreground)")};
  background: ${({ $selected }) => ($selected ? "var(--primary)" : "transparent")};

  &:hover {
    background: #c9c6c6;
    color: var(--foreground);
  }
`
