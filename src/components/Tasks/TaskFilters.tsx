import styled from "@emotion/styled"
import type { ColumnFiltersState } from "@tanstack/react-table"
import { filter } from "lodash"
import { type ReactNode, useCallback } from "react"
import { exportTasksToExcel } from "src/functions/export-excel"
import { matchesQuickFilter } from "src/functions/filter-utils"
import { QuickFilter } from "src/utils/filter-utils"
import {
	multiSelectFilter,
	sortByTaskColumns,
	TASK_COLUMN_DEFINITIONS,
	type TaskColumnMeta,
	type TaskRow,
} from "src/utils/task-table-utils"
import { useTasksFilters } from "../../providers/TasksFiltersProvider"
import { FilterBar, FilterPill } from "../shared/FilterBar"
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip"

interface TaskFiltersProps {
	taskRows: TaskRow[]
	onClearColumnFilters?: () => void
	onClearQuickFilters?: () => void
	extraFilters?: ReactNode
	extraButtons?: ReactNode
	extraColumnsMeta?: TaskColumnMeta[]
	tabFilter?: QuickFilter[]
	onToggleTabFilter?: (filter: QuickFilter) => void
	startSlot?: ReactNode
	allTasksLength?: number
	urlColumnFilters?: ColumnFiltersState
}

function TaskFilters({
	taskRows,
	onClearColumnFilters,
	onClearQuickFilters,
	extraFilters,
	extraColumnsMeta,
	tabFilter,
	onToggleTabFilter,
	startSlot,
	allTasksLength = taskRows.length,
	urlColumnFilters = [],
	extraButtons,
}: TaskFiltersProps) {
	const {
		activeQuickFilters,
		toggleQuickFilter,
		clearQuickFilters,
		columnOrder,
		hiddenColumns,
		columnsFilters,
		setColumnsFilters,
		sorting,
	} = useTasksFilters()

	const activeFilters =
		tabFilter !== undefined ? new Set(tabFilter) : activeQuickFilters
	const handleToggle = onToggleTabFilter ?? toggleQuickFilter

	const hasActiveColumnFilters =
		columnsFilters.length > 0 || urlColumnFilters.length > 0

	function clearAllColumnFilters() {
		setColumnsFilters([])
		onClearColumnFilters?.()
	}

	function handleClearAllQuickFilters() {
		clearQuickFilters()
		onClearQuickFilters?.()
	}

	const allColumnFilters = [...urlColumnFilters, ...columnsFilters]

	const filteredTaskRows = filter(taskRows, (task) =>
		allColumnFilters.every(({ id, value }, index) => {
			const accessorFn =
				TASK_COLUMN_DEFINITIONS[id as keyof TaskRow]?.accessorFn

			return (
				!accessorFn ||
				multiSelectFilter(accessorFn?.(task, index), value as string[])
			)
		}),
	)

	filter

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
		exportTasksToExcel(sortByTaskColumns(filteredTaskRows, sorting), {
			columnOrder,
			hiddenColumns,
		})
	}, [filteredTaskRows, columnOrder, hiddenColumns, sorting])

	return (
		<FilterBar
			hasActiveFilters={hasActiveColumnFilters}
			onClearAll={clearAllColumnFilters}
			onExport={handleExport}
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

			<FilterPill
				$active={activeFilters.size === 0}
				onClick={handleClearAllQuickFilters}
			>
				הכל ({allTasksLength})
			</FilterPill>
			{extraButtons}
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
