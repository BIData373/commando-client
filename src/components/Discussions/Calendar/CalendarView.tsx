import styled from "@emotion/styled"
import { useState } from "react"
import { useListSources } from "../../../api/source/source"
import {
	CalendarRange,
	shiftAnchorDate,
} from "../../../functions/calendar-range"
import { useWorkspace } from "../../../providers/WorkspaceProvider"
import { CalendarToolbar } from "./CalendarToolbar"
import { DiscussionsCalendar } from "./DiscussionsCalendar"

export function CalendarView() {
	const {
		workspace: { id: workspaceId },
	} = useWorkspace()
	const { data: discussions = [] } = useListSources({ workspaceId })

	const [anchorDate, setAnchorDate] = useState(() => new Date())
	const [range, setRange] = useState(CalendarRange.MONTH)
	const [searchQuery, setSearchQuery] = useState("")

	const normalizedQuery = searchQuery.trim()
	const matchingDiscussions = discussions.filter((discussion) =>
		discussion.name.includes(normalizedQuery),
	)

	function handlePrevious() {
		setAnchorDate((date) => shiftAnchorDate(date, range, -1))
	}

	function handleNext() {
		setAnchorDate((date) => shiftAnchorDate(date, range, 1))
	}

	function handleToday() {
		setAnchorDate(new Date())
	}

	return (
		<Root>
			<CalendarToolbar
				anchorDate={anchorDate}
				range={range}
				onPrevious={handlePrevious}
				onNext={handleNext}
				onToday={handleToday}
				onRangeChange={setRange}
				searchQuery={searchQuery}
				onSearchChange={setSearchQuery}
			/>

			<DiscussionsCalendar
				anchorDate={anchorDate}
				range={range}
				discussions={matchingDiscussions}
			/>
		</Root>
	)
}

const Root = styled.div`
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
`
