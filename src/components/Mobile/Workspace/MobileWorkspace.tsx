import styled from "@emotion/styled"
import { useNavigate } from "@tanstack/react-router"
import { useState } from "react"
import { TbFilter, TbFilterOff } from "react-icons/tb"
import { QuickFilter, type TaskRowDto } from "src/api/model"
import { useListTaskRows } from "src/api/task/task"
import { LoadingSpinner } from "src/components/shared/LoadingSpinner"
import { FilterPill } from "src/components/Tasks/TaskFilters"
import { matchesQuickFilter } from "src/functions/filter-utils"
import { formatSourceLabel } from "src/functions/source-utils"
import { useFilteredTasks } from "src/hooks/useFilteredTasks"
import { useTasksFilters } from "src/providers/TasksFiltersProvider"
import { useWorkspace } from "src/providers/WorkspaceProvider"
import { ACTIVE_QUICK_FILTERS } from "src/utils/filter-utils"
import MobileHeader from "../MobileHeader"
import SearchInput from "../shared/SearchInput"
import MobileFilterSheet, { type FilterKey } from "./MobileFilterSheet"
import MobileStatusBar from "./MobileStatusBar"
import MobileTaskCard from "./MobileTaskCard"

const QUICK_FILTER_LABELS: Record<QuickFilter, string> = {
	[QuickFilter.overdue]: 'חריגה מתג"ב',
	[QuickFilter.approaching]: 'תג"ב מתקרב',
	[QuickFilter.flagged]: "במיקוד",
	[QuickFilter.rolling]: "שוטפות",
}

export default function MobileWorkspace() {
	const {
		workspace: { id: workspaceId, icon, title, urlName },
	} = useWorkspace()
	const navigate = useNavigate()
	const {
		searchQuery,
		setSearchQuery,
		activeQuickFilters,
		toggleQuickFilter,
		clearQuickFilters,
		columnsFilters,
		dateRange,
	} = useTasksFilters()

	const { data: tasks = [], isLoading } = useListTaskRows({
		workspaceId,
		isArchived: false,
	})

	const [filterSheetOpen, setFilterSheetOpen] = useState(false)
	const [searchFocused, setSearchFocused] = useState(false)

	const activeFilterCount = columnsFilters.length + (dateRange ? 1 : 0)
	const hasActiveFilters = activeFilterCount > 0

	const columnAccessors: Record<
		Exclude<FilterKey, "date">,
		(task: TaskRowDto) => string
	> = {
		assignee: (t) => t.assignee?.name ?? "",
		source: (t) => (t.source ? formatSourceLabel(t.source) : ""),
		status: (t) => t.status.type,
	}

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

	function handleOpenTask(task: TaskRowDto) {
		navigate({
			to: "/workspace/$urlName/tasks/$taskId",
			params: { urlName, taskId: String(task.id) },
		})
	}

	return (
		<PageRoot>
			<MobileHeader icon={icon} title={title} minimal={searchFocused} />

			<Content>
				{!searchFocused && !hasActiveFilters && <MobileStatusBar />}

				{hasActiveFilters ? (
					<>
						<ActiveFiltersBar>
							<ActiveFiltersLabel onClick={() => setFilterSheetOpen(true)}>
								סננים פעילים ({activeFilterCount})
							</ActiveFiltersLabel>
							<ClearFiltersButton onClick={() => setFilterSheetOpen(true)}>
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
						filtered.map((task) => (
							<MobileTaskCard
								key={task.rowKey}
								task={task}
								searchQuery={searchQuery}
								onClick={() => handleOpenTask(task)}
							/>
						))
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
