import styled from "@emotion/styled"
import { TbFilter, TbFilterOff } from "react-icons/tb"
import type { TaskRowDto } from "src/api/model"
import SearchInput from "src/components/shared/SearchInput"
import { FilterPill } from "src/components/Tasks/TaskFilters"
import { matchesQuickFilter } from "src/functions/filter-utils"
import type { StatusTaskCount } from "src/functions/status-counts"
import { useTasksFilters } from "src/providers/TasksFiltersProvider"
import {
	ACTIVE_QUICK_FILTERS,
	QUICK_FILTER_LABELS,
} from "src/utils/filter-utils"
import MobileStatusBar from "./MobileStatusBar"

interface MobileTasksToolbarProps {
	tasks: TaskRowDto[]
	statusSegments: StatusTaskCount[]
	matchCount: number
	searchFocused: boolean
	onSearchFocus: () => void
	onSearchBlur: () => void
	onOpenFilters: () => void
}

export default function MobileTasksToolbar({
	tasks,
	statusSegments,
	matchCount,
	searchFocused,
	onSearchFocus,
	onSearchBlur,
	onOpenFilters,
}: MobileTasksToolbarProps) {
	const {
		searchQuery,
		setSearchQuery,
		activeQuickFilters,
		toggleQuickFilter,
		clearQuickFilters,
		columnsFilters,
		dateRange,
		clearMobileFilters,
	} = useTasksFilters()

	const activeFilterCount = columnsFilters.length + (dateRange ? 1 : 0)

	if (activeFilterCount > 0) {
		return (
			<>
				<ActiveFiltersBar>
					<ActiveFiltersLabel onClick={onOpenFilters}>
						סננים פעילים ({activeFilterCount})
					</ActiveFiltersLabel>
					<ClearFiltersButton onClick={clearMobileFilters}>
						<TbFilterOff size={16} />
						נקה סננים
					</ClearFiltersButton>
				</ActiveFiltersBar>
				<MatchCount>נמצאו {matchCount} הנחיות תואמות</MatchCount>
			</>
		)
	}

	return (
		<>
			{!searchFocused && (
				<MobileStatusBar
					segments={statusSegments}
					totalTaskCount={tasks.length}
				/>
			)}

			<HeaderRow>
				<SearchInput
					value={searchQuery}
					onChange={setSearchQuery}
					placeholder="חפש הנחייה"
					onFocus={onSearchFocus}
					onBlur={onSearchBlur}
				/>
				{!searchFocused && (
					<FilterButton onClick={onOpenFilters}>
						<TbFilter size={18} />
					</FilterButton>
				)}
			</HeaderRow>

			<ChipsRow>
				<FilterPill
					$active={activeQuickFilters.size === 0}
					onClick={clearQuickFilters}
				>
					הכל ({tasks.length})
				</FilterPill>
				{ACTIVE_QUICK_FILTERS.map((filter) => {
					const count = tasks.filter((t) =>
						matchesQuickFilter(t, filter),
					).length

					return (
						<FilterPill
							key={filter}
							$active={activeQuickFilters.has(filter)}
							onClick={() => toggleQuickFilter(filter)}
						>
							{QUICK_FILTER_LABELS[filter]}
							{count > 0 && ` (${count})`}
						</FilterPill>
					)
				})}
			</ChipsRow>
		</>
	)
}

const HeaderRow = styled.div`
	display: flex;
	gap: 10px;
	align-items: stretch;
	direction: rtl;
`

const FilterButton = styled.button`
	display: flex;
	align-items: center;
	justify-content: center;
	width: 48px;
	height: 48px;
	border-radius: 8px;
	border: 1px solid var(--line);
	background: var(--background);
	color: var(--sea-ink);
	flex-shrink: 0;
`

const ChipsRow = styled.div`
	display: flex;
	gap: 8px;
	overflow-x: auto;
	direction: rtl;
	flex-shrink: 0;

	&::-webkit-scrollbar {
		display: none;
	}
`

const ActiveFiltersBar = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	direction: rtl;
	height: 57px;
	padding: 8px 16px;
	margin: -12px -16px 0;
	background: var(--background-mobile);
	box-shadow: var(--card-shadow);
`

const ActiveFiltersLabel = styled.button`
	background: none;
	border: none;
	padding: 0;
	font-size: var(--fs-btn);
	font-weight: 400;
	color: var(--text-color-2);
`

const ClearFiltersButton = styled.button`
	display: flex;
	align-items: center;
	gap: 8px;
	height: 32px;
	padding: 0 15px;
	background: var(--link-bg-hover);
	border: none;
	border-radius: 8px 6px 8px 8px;
	font-size: var(--fs-btn);
	font-weight: 400;
	color: var(--text-color-2);
`

const MatchCount = styled.div`
	direction: rtl;
	font-size: var(--fs-btn);
	color: var(--Colors-Base-Neutral-8);
`
