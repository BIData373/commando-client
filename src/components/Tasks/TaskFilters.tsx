import styled from "@emotion/styled"
import type { ColumnFiltersState } from "@tanstack/react-table"
import { filter } from "lodash"
import { type ReactNode, useCallback } from "react"
import { exportTasksToExcel } from "src/functions/export-excel"
import { matchesQuickFilter } from "src/functions/filter-utils"
import { getTaskValue, QuickFilter } from "src/utils/filter-utils"
import type { TaskColumnMeta, TaskRow } from "src/utils/task-table-utils"
import { useTasksFilters } from "../../providers/TasksFiltersProvider"
import { FilterBar, FilterDivider, FilterPill } from "../shared/FilterBar"
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip"

interface TaskFiltersProps {
	taskRows: TaskRow[]
	onClearAllFilters: () => void
	hasExtraActiveFilters?: boolean
	extraFilters?: ReactNode
	extraColumnsMeta?: TaskColumnMeta[]
	tabFilter?: QuickFilter[]
	onToggleTabFilter?: (filter: QuickFilter) => void
	startSlot?: ReactNode
	allTasksLength: number
	urlColumnFilters?: ColumnFiltersState
}

function TaskFilters({
	taskRows,
	onClearAllFilters,
	hasExtraActiveFilters,
	extraFilters,
	extraColumnsMeta,
	tabFilter,
	onToggleTabFilter,
	startSlot,
	allTasksLength,
	urlColumnFilters = [],
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
		columnsFilters,
	} = useTasksFilters()

	const activeFilters =
		tabFilter !== undefined ? new Set(tabFilter) : activeQuickFilters
	const handleToggle = onToggleTabFilter ?? toggleQuickFilter

	const hasActiveFilters = activeFilters.size > 0 || !!hasExtraActiveFilters

	const allColumnFilters = [...urlColumnFilters, ...columnsFilters]

	const filteredTaskRows = filter(taskRows, (task) =>
		allColumnFilters.every(({ id, value }) => {
			const idKey = id as keyof TaskRow
			const taskValue = getTaskValue(idKey, task)
			if (!Array.isArray(value) || value.length === 0) return true
			return value.includes(taskValue)
		}),
	)

	const overdueCount = filteredTaskRows.filter((t) =>
		matchesQuickFilter(t, QuickFilter.OVERDUE),
	).length
	const approachingCount = filteredTaskRows.filter((t) =>
		matchesQuickFilter(t, QuickFilter.APPROACHING),
	).length
	const flaggedCount = filteredTaskRows.filter((t) =>
		matchesQuickFilter(t, QuickFilter.FLAGGED),
	).length

	const handleExport = useCallback(() => {
		exportTasksToExcel(filteredTaskRows, { columnOrder, hiddenColumns })
	}, [filteredTaskRows, columnOrder, hiddenColumns])

	return (
		<FilterBar
			hasActiveFilters={hasActiveFilters}
			onClearAll={onClearAllFilters}
			searchQuery={searchQuery}
			onSearchChange={setSearchQuery}
			onExport={handleExport}
			columnOrder={columnOrder}
			hiddenColumns={hiddenColumns}
			onColumnOrderChange={setColumnOrder}
			onToggleColumn={toggleColumn}
			extraColumnsMeta={extraColumnsMeta}
			startSlot={startSlot}
		>
			{extraFilters}

			<FilterPill
				$active={activeFilters.has(QuickFilter.FLAGGED)}
				onClick={() => handleToggle(QuickFilter.FLAGGED)}
			>
				חשובות{flaggedCount > 0 && ` (${flaggedCount})`}
			</FilterPill>

			<Tooltip>
				<WarningTrigger>
					<FilterPill
						$active={activeFilters.has(QuickFilter.APPROACHING)}
						onClick={() => handleToggle(QuickFilter.APPROACHING)}
					>
						תג"ב מתקרב{approachingCount > 0 && ` (${approachingCount})`}
					</FilterPill>
				</WarningTrigger>

				<TooltipContent>תג"ב בעוד 2 ימים או פחות</TooltipContent>
			</Tooltip>

			<FilterPill
				$active={activeFilters.has(QuickFilter.OVERDUE)}
				onClick={() => handleToggle(QuickFilter.OVERDUE)}
			>
				חריגה מתג"ב{overdueCount > 0 && ` (${overdueCount})`}
			</FilterPill>

			<FilterDivider />

			<FilterPill $active={!hasActiveFilters} onClick={onClearAllFilters}>
				הכל ({allTasksLength})
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
