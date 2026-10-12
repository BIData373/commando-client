import styled from "@emotion/styled"
import { type ReactNode, useState } from "react"
import { TbFilter, TbFilterOff } from "react-icons/tb"
import { QuickFilter, type TaskRowDto } from "src/api/model"
import { LoadingSpinner } from "src/components/shared/LoadingSpinner"
import { FilterPill } from "src/components/Tasks/TaskFilters"
import { matchesQuickFilter } from "src/functions/filter-utils"
import { formatSourceLabel } from "src/functions/source-utils"
import { useFilteredTasks } from "src/hooks/useFilteredTasks"
import { useTasksFilters } from "src/providers/TasksFiltersProvider"
import { ACTIVE_QUICK_FILTERS } from "src/utils/filter-utils"
import MobileHeader from "../MobileHeader"
import MobileFilterSheet, {
	type FilterKey,
} from "../Workspace/MobileFilterSheet"
import SearchInput from "./SearchInput"

const QUICK_FILTER_LABELS: Record<QuickFilter, string> = {
	[QuickFilter.overdue]: 'חריגה מתג"ב',
	[QuickFilter.approaching]: 'תג"ב מתקרב',
	[QuickFilter.flagged]: "במיקוד",
	[QuickFilter.rolling]: "שוטפות",
}

const columnAccessors: Record<
	Exclude<FilterKey, "date">,
	(task: TaskRowDto) => string
> = {
	assignee: (t) => t.assignee?.name ?? "",
	source: (t) => (t.source ? formatSourceLabel(t.source) : ""),
	status: (t) => t.status.type,
}

interface MobileTasksLayoutProps<T extends TaskRowDto> {
	headerIcon?: string | null
	headerTitle: string
	tasks: T[]
	isLoading: boolean
	statusBar?: ReactNode
	onOpenTask: (task: T) => void
	renderCard: (task: T, searchQuery: string) => ReactNode
}

export default function MobileTasksLayout<T extends TaskRowDto>({
	headerIcon,
	headerTitle,
	tasks,
	isLoading,
	statusBar,
	renderCard,
}: MobileTasksLayoutProps<T>) {
	const {
		searchQuery,
		setSearchQuery,
		activeQuickFilters,
		toggleQuickFilter,
		clearQuickFilters,
		columnsFilters,
		dateRange,
		clearAllFilters,
	} = useTasksFilters()

	const [filterSheetOpen, setFilterSheetOpen] = useState(false)
	const [searchFocused, setSearchFocused] = useState(false)

	const activeFilterCount = columnsFilters.length + (dateRange ? 1 : 0)
	const hasActiveFilters = activeFilterCount > 0

	function matchesColumnFilters(task: TaskRowDto): boolean {
		return columnsFilters.every(({ id, value }) => {
			const accessor = columnAccessors[id as Exclude<FilterKey, "date">]
			return accessor ? (value as string[]).includes(accessor(task)) : true
		})
	}

	const filtered = useFilteredTasks(tasks, {
		additionalFilter:
			columnsFilters.length > 0 ? matchesColumnFilters : undefined,
	})

	return (
		<PageRoot>
			<MobileHeader
				icon={headerIcon}
				title={headerTitle}
				minimal={searchFocused}
			/>

			<Content>
				{!searchFocused && !hasActiveFilters && statusBar}

				{hasActiveFilters ? (
					<>
						<ActiveFiltersBar>
							<ActiveFiltersLabel onClick={() => setFilterSheetOpen(true)}>
								סננים פעילים ({activeFilterCount})
							</ActiveFiltersLabel>
							<ClearFiltersButton onClick={clearAllFilters}>
								<TbFilterOff size={16} />
								נקה סננים
							</ClearFiltersButton>
						</ActiveFiltersBar>
						<MatchCount>נמצאו {filtered.length} הנחיות תואמות</MatchCount>
					</>
				) : (
					<>
						<HeaderRow>
							<SearchInput
								value={searchQuery}
								onChange={setSearchQuery}
								placeholder="חפש הנחייה"
								onFocus={() => setSearchFocused(true)}
								onBlur={() => setSearchFocused(false)}
							/>
							{!searchFocused && (
								<FilterButton onClick={() => setFilterSheetOpen(true)}>
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
				)}

				<CardList>
					{isLoading ? (
						<LoadingWrapper>
							<LoadingSpinner />
						</LoadingWrapper>
					) : filtered.length === 0 ? (
						<EmptyState>לא נמצאו הנחיות</EmptyState>
					) : (
						filtered.map((task) => renderCard(task, searchQuery))
					)}
				</CardList>
			</Content>

			<MobileFilterSheet
				open={filterSheetOpen}
				onClose={() => setFilterSheetOpen(false)}
				tasks={tasks}
				filteredCount={filtered.length}
			/>
		</PageRoot>
	)
}

const PageRoot = styled.div`
	display: flex;
	flex-direction: column;
	height: 100%;
	background: var(--background-mobile);

	button,
	[role="button"] {
		&:active:not(:disabled) {
			opacity: 0.7;
		}
	}
`

const Content = styled.div`
	direction: ltr;
	display: flex;
	flex-direction: column;
	gap: 12px;
	padding: 12px 16px;
	flex: 1;
	min-height: 0;
	overflow-y: auto;

	&::-webkit-scrollbar {
		display: none;
	}

	scrollbar-width: none;
`

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

const CardList = styled.div`
	display: flex;
	flex-direction: column;
	gap: 12px;
	flex: 1;
	min-height: 0;
`

const LoadingWrapper = styled.div`
	display: flex;
	flex: 1;
	align-items: center;
	justify-content: center;
`

const EmptyState = styled.div`
	display: flex;
	flex: 1;
	align-items: center;
	justify-content: center;
	color: var(--sea-ink-soft);
	font-size: var(--fs-base);
`
