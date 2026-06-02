import styled from "@emotion/styled"
import type { ReactNode } from "react"
import { matchesQuickFilter } from "src/functions/filter-utils"
import { QuickFilter } from "src/utils/filter-utils"
import type { TaskColumnMeta } from "../../hooks/useTaskColumns"
import type { TaskRow } from "../../providers/TasksFiltersProvider"
import { useTasksFilters } from "../../providers/TasksFiltersProvider"
import { FilterBar, FilterDivider, FilterPill } from "../shared/FilterBar"
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip"

interface TaskFiltersProps {
	tasks: TaskRow[]
	onClearAllFilters: () => void
	onExport: () => void
	hasExtraActiveFilters?: boolean
	extraFilters?: ReactNode
	extraColumnsMeta?: TaskColumnMeta[]
}

function TaskFilters({
	tasks,
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

	const overdueCount = tasks.filter((t) =>
		matchesQuickFilter(t, QuickFilter.OVERDUE),
	).length
	const approachingCount = tasks.filter((t) =>
		matchesQuickFilter(t, QuickFilter.APPROACHING),
	).length
	const flaggedCount = tasks.filter((t) =>
		matchesQuickFilter(t, QuickFilter.FLAGGED),
	).length

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
				{tasks.length}
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
