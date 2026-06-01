import styled from "@emotion/styled"
import type { ReactNode } from "react"
import { QuickFilter } from "src/utils/filter-utils"
import { matchesQuickFilter } from "../../functions/filter-utils"
import type { TaskColumnMeta } from "../../hooks/useTaskColumns"
import { useTasksFilters } from "../../providers/TasksFiltersProvider"
import { FilterBar, FilterDivider, FilterPill } from "../shared/FilterBar"
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip"

interface TaskFiltersProps {
	onClearAllFilters: () => void
	onExport: () => void
	hasExtraActiveFilters?: boolean
	extraFilters?: ReactNode
	extraColumnsMeta?: TaskColumnMeta[]
}

function TaskFilters({
	onClearAllFilters,
	onExport,
	hasExtraActiveFilters,
	extraFilters,
	extraColumnsMeta,
}: TaskFiltersProps) {
	const {
		activeQuickFilters,
		toggleQuickFilter,
		searchQuery,
		setSearchQuery,
		columnOrder,
		setColumnOrder,
		hiddenColumns,
		toggleColumn,
	} = useTasksFilters()

	const hasActiveFilters =
		activeQuickFilters.size > 0 || !!hasExtraActiveFilters

	// TODO - implement
	const overdueCount = 0
	// const overdueCount = tasks.filter((t) =>
	// 	matchesQuickFilter(t, QuickFilter.OVERDUE),
	// ).length;
	const approachingCount = 0
	// const approachingCount = tasks.filter((t) =>
	// 	matchesQuickFilter(t, QuickFilter.APPROACHING),
	// ).length;
	const flaggedCount = 0
	// const flaggedCount = tasks.filter((t) =>
	// 	matchesQuickFilter(t, QuickFilter.FLAGGED),
	// ).length;

	return (
		<FilterBar
			hasActiveFilters={hasActiveFilters}
			onClearAll={onClearAllFilters}
			searchQuery={searchQuery}
			onSearchChange={setSearchQuery}
			onExport={onExport}
			columnOrder={columnOrder}
			hiddenColumns={hiddenColumns}
			onColumnOrderChange={setColumnOrder}
			onToggleColumn={toggleColumn}
			extraColumnsMeta={extraColumnsMeta}
		>
			{extraFilters}

			<FilterPill
				$active={activeQuickFilters.has(QuickFilter.FLAGGED)}
				onClick={() => toggleQuickFilter(QuickFilter.FLAGGED)}
			>
				חשובות{flaggedCount > 0 && ` (${flaggedCount})`}
			</FilterPill>

			<Tooltip>
				<WarningTrigger>
					<FilterPill
						$active={activeQuickFilters.has(QuickFilter.APPROACHING)}
						onClick={() => toggleQuickFilter(QuickFilter.APPROACHING)}
					>
						תג"ב מתקרב{approachingCount > 0 && ` (${approachingCount})`}
					</FilterPill>
				</WarningTrigger>

				<TooltipContent>תג"ב בעוד 2 ימים או פחות</TooltipContent>
			</Tooltip>

			<FilterPill
				$active={activeQuickFilters.has(QuickFilter.OVERDUE)}
				onClick={() => toggleQuickFilter(QuickFilter.OVERDUE)}
			>
				חריגה מתג"ב{overdueCount > 0 && ` (${overdueCount})`}
			</FilterPill>

			<FilterDivider />

			<FilterPill $active={!hasActiveFilters} onClick={onClearAllFilters}>
				0{/* TODO - implement */}
				{/* הכל ({tasks.length}) */}
			</FilterPill>
		</FilterBar>
	)
}

export { TaskFilters }

const WarningTrigger = styled(TooltipTrigger)`
  display: inline-flex;
  align-items: center;
  background: none;
  border: none;
  padding: 0;
  cursor: default;
  line-height: 0;
`
