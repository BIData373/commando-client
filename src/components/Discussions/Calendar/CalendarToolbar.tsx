import styled from "@emotion/styled"
import { TEST_IDS } from "../../../consts/test-ids"
import type { CalendarRange } from "../../../functions/calendar-range"
import SearchInput from "../../shared/SearchInput"
import { CalendarDateNavigation } from "./CalendarDateNavigation"
import { CalendarRangeSelector } from "./CalendarRangeSelector"

interface CalendarToolbarProps {
	anchorDate: Date
	range: CalendarRange
	onPrevious: () => void
	onNext: () => void
	onToday: () => void
	onRangeChange: (range: CalendarRange) => void
	searchQuery: string
	onSearchChange: (value: string) => void
}

export function CalendarToolbar({
	anchorDate,
	range,
	onPrevious,
	onNext,
	onToday,
	onRangeChange,
	searchQuery,
	onSearchChange,
}: CalendarToolbarProps) {
	return (
		<Root>
			<CalendarDateNavigation
				anchorDate={anchorDate}
				range={range}
				onPrevious={onPrevious}
				onNext={onNext}
				onToday={onToday}
			/>

			<EndGroup>
				<DiscussionSearchInput
					testId={TEST_IDS.discussions.search}
					placeholder="חפש דיון"
					value={searchQuery}
					onChange={onSearchChange}
				/>
				<CalendarRangeSelector range={range} onRangeChange={onRangeChange} />
			</EndGroup>
		</Root>
	)
}

const Root = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 40px;
`

const EndGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`

const DiscussionSearchInput = styled(SearchInput)`
  flex: none;
  width: 280px;
`
