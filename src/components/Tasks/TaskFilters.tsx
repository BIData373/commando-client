import styled from "@emotion/styled"
import type { ReactNode } from "react"
import type { Task } from "../../data/Tasks"
import { matchesQuickFilter } from "../../functions/filter-utils"
import type { TaskColumn, TaskColumnMeta } from "../../hooks/useTaskColumns"
import { FilterBar, FilterDivider, FilterPill } from "../shared/FilterBar"
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip"

type QuickFilter = "overdue" | "approaching" | "flagged"

interface TaskFiltersProps {
	tasks: Task[]
	activeQuickFilters: Set<QuickFilter>
	onToggleQuickFilter: (filter: QuickFilter) => void
	onClearAllFilters: () => void
	searchQuery: string
	onSearchChange: (value: string) => void
	onExport: () => void
	columnOrder: TaskColumn[]
	hiddenColumns: Set<TaskColumn>
	onColumnOrderChange: (order: TaskColumn[]) => void
	onToggleColumn: (columnId: TaskColumn) => void
	hasExtraActiveFilters?: boolean
	extraFilters?: ReactNode
	extraColumnsMeta?: TaskColumnMeta[]
}

function TaskFilters({
	tasks,
	activeQuickFilters,
	onToggleQuickFilter,
	onClearAllFilters,
	searchQuery,
	onSearchChange,
	onExport,
	columnOrder,
	hiddenColumns,
	onColumnOrderChange,
	onToggleColumn,
	hasExtraActiveFilters,
	extraFilters,
	extraColumnsMeta,
}: TaskFiltersProps) {
	const hasActiveFilters =
		activeQuickFilters.size > 0 || !!hasExtraActiveFilters

	const overdueCount = tasks.filter((t) =>
		matchesQuickFilter(t, "overdue"),
	).length
	const approachingCount = tasks.filter((t) =>
		matchesQuickFilter(t, "approaching"),
	).length
	const flaggedCount = tasks.filter((t) =>
		matchesQuickFilter(t, "flagged"),
	).length

	return (
		<FilterBar
			hasActiveFilters={hasActiveFilters}
			onClearAll={onClearAllFilters}
			searchQuery={searchQuery}
			onSearchChange={onSearchChange}
			onExport={onExport}
			columnOrder={columnOrder}
			hiddenColumns={hiddenColumns}
			onColumnOrderChange={onColumnOrderChange}
			onToggleColumn={onToggleColumn}
			extraColumnsMeta={extraColumnsMeta}
		>
			{extraFilters}
			<FilterPill
				$active={activeQuickFilters.has("flagged")}
				onClick={() => onToggleQuickFilter("flagged")}
			>
				חשובות{flaggedCount > 0 && ` (${flaggedCount})`}
			</FilterPill>
			<Tooltip>
				<WarningTrigger>
					<FilterPill
						$active={activeQuickFilters.has("approaching")}
						onClick={() => onToggleQuickFilter("approaching")}
					>
						תג"ב מתקרב{approachingCount > 0 && ` (${approachingCount})`}
					</FilterPill>
				</WarningTrigger>
				<TooltipContent>תג"ב בעוד 2 ימים או פחות</TooltipContent>
			</Tooltip>
			<FilterPill
				$active={activeQuickFilters.has("overdue")}
				onClick={() => onToggleQuickFilter("overdue")}
			>
				חריגה מתג"ב{overdueCount > 0 && ` (${overdueCount})`}
			</FilterPill>
			<FilterDivider />
			<FilterPill $active={!hasActiveFilters} onClick={onClearAllFilters}>
				הכל ({tasks.length})
			</FilterPill>
		</FilterBar>
	)
}

export { TaskFilters }
export type { QuickFilter }

const WarningTrigger = styled(TooltipTrigger)`
  display: inline-flex;
  align-items: center;
  background: none;
  border: none;
  padding: 0;
  cursor: default;
  line-height: 0;
`
