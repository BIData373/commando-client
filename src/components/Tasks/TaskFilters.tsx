import styled from "@emotion/styled"
import type { ColumnDef, ColumnFiltersState } from "@tanstack/react-table"
import { FilterX } from "lucide-react"
import { type ReactNode, useMemo } from "react"
import type { TaskRowDto } from "src/api/model"
import { QuickFilter } from "src/api/model/quick-filter"
import { matchesQuickFilter } from "src/functions/filter-utils"
import {
	buildCountingColumns,
	type TaskColumnMeta,
} from "src/utils/task-table-utils"
import { useHeadlessTable } from "../../hooks/useHeadlessTable"
import { useTasksFilters } from "../../providers/TasksFiltersProvider"
import { ColumnVisibilityDropdown } from "../Tasks/ColumnVisibilityDropdown"
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip"
import { ExportButton } from "./ExportButton"
import { TaskSearchInput } from "./TaskSearchInput"

interface TaskFiltersProps<TTask extends TaskRowDto> {
	allTaskRows: TTask[]
	filteredTasks: TTask[]
	columnOrder: (keyof TTask)[]
	hiddenColumns: Set<keyof TTask>
	onClearColumnFilters?: () => void
	extraFilters?: ReactNode
	extraButtons?: ReactNode
	extraColumns?: ColumnDef<TTask>[]
	extraColumnsMeta?: TaskColumnMeta[]
	startSlot?: ReactNode
	urlColumnFilters?: ColumnFiltersState
	exportFilePrefix?: string
	quickFilters: QuickFilter[]
}

export function TaskFilters<TTask extends TaskRowDto>({
	allTaskRows,
	filteredTasks,
	columnOrder,
	hiddenColumns,
	onClearColumnFilters,
	extraFilters,
	extraColumns = [],
	extraColumnsMeta,
	startSlot,
	urlColumnFilters = [],
	extraButtons,
	exportFilePrefix,
	quickFilters,
}: TaskFiltersProps<TTask>) {
	const {
		activeQuickFilters,
		toggleQuickFilter,
		clearQuickFilters,
		columnsFilters,
		setColumnsFilters,
	} = useTasksFilters()

	const hasActiveColumnFilters =
		columnsFilters.length > 0 || urlColumnFilters.length > 0

	function clearAllColumnFilters() {
		setColumnsFilters([])
		onClearColumnFilters?.()
	}

	const allColumnFilters = useMemo(
		() => [...urlColumnFilters, ...columnsFilters],
		[urlColumnFilters, columnsFilters],
	)

	const countingColumns = useMemo(
		() => buildCountingColumns(extraColumns),
		[extraColumns],
	)

	const countingTable = useHeadlessTable({
		data: allTaskRows,
		columns: countingColumns,
		columnFilters: allColumnFilters,
	})

	const filteredRowsForCounts = countingTable.getFilteredRowModel().rows

	const taskRowsForCounts = useMemo(
		() => filteredRowsForCounts.map((row) => row.original),
		[filteredRowsForCounts],
	)

	const overdueCount = useMemo(
		() =>
			taskRowsForCounts.filter((t) =>
				matchesQuickFilter(t, QuickFilter.overdue),
			).length,
		[taskRowsForCounts],
	)

	const approachingCount = useMemo(
		() =>
			taskRowsForCounts.filter((t) =>
				matchesQuickFilter(t, QuickFilter.approaching),
			).length,
		[taskRowsForCounts],
	)

	const flaggedCount = useMemo(
		() =>
			taskRowsForCounts.filter((t) =>
				matchesQuickFilter(t, QuickFilter.flagged),
			).length,
		[taskRowsForCounts],
	)

	const rollingCount = useMemo(
		() =>
			taskRowsForCounts.filter((t) =>
				matchesQuickFilter(t, QuickFilter.rolling),
			).length,
		[taskRowsForCounts],
	)

	const quickFilterButtons = useMemo<Record<QuickFilter, ReactNode>>(
		() => ({
			[QuickFilter.flagged]: (
				<FilterPill
					key={QuickFilter.flagged}
					$active={activeQuickFilters.has(QuickFilter.flagged)}
					onClick={() => toggleQuickFilter(QuickFilter.flagged)}
				>
					חשובות{flaggedCount > 0 && ` (${flaggedCount})`}
				</FilterPill>
			),
			[QuickFilter.approaching]: (
				<Tooltip key={QuickFilter.approaching}>
					<WarningTrigger>
						<FilterPill
							$active={activeQuickFilters.has(QuickFilter.approaching)}
							onClick={() => toggleQuickFilter(QuickFilter.approaching)}
						>
							תג"ב מתקרב{approachingCount > 0 && ` (${approachingCount})`}
						</FilterPill>
					</WarningTrigger>
					<TooltipContent>תג"ב בעוד 2 ימים או פחות</TooltipContent>
				</Tooltip>
			),
			[QuickFilter.overdue]: (
				<FilterPill
					key={QuickFilter.overdue}
					$active={activeQuickFilters.has(QuickFilter.overdue)}
					onClick={() => toggleQuickFilter(QuickFilter.overdue)}
				>
					חריגה מתג"ב{overdueCount > 0 && ` (${overdueCount})`}
				</FilterPill>
			),
			[QuickFilter.rolling]: (
				<FilterPill
					key={QuickFilter.rolling}
					$active={activeQuickFilters.has(QuickFilter.rolling)}
					onClick={() => toggleQuickFilter(QuickFilter.rolling)}
				>
					שוטפות{rollingCount > 0 && ` (${rollingCount})`}
				</FilterPill>
			),
		}),
		[
			activeQuickFilters,
			flaggedCount,
			approachingCount,
			overdueCount,
			rollingCount,
			toggleQuickFilter,
		],
	)

	return (
		<BarRoot>
			<BarStart>
				{startSlot}

				<FilterDivider />

				<ColumnVisibilityDropdown extraColumnsMeta={extraColumnsMeta} />

				<ExportButton
					tasks={filteredTasks}
					allColumnFilters={allColumnFilters}
					columnOrder={columnOrder}
					hiddenColumns={hiddenColumns}
					extraColumns={extraColumns}
					exportFilePrefix={exportFilePrefix}
				/>

				<TaskSearchInput />
			</BarStart>

			<BarEnd>
				{hasActiveColumnFilters && (
					<>
						<ClearButton onClick={clearAllColumnFilters}>
							<FilterX size={18} />
							נקה סננים
						</ClearButton>

						<FilterSeparator />
					</>
				)}

				{extraFilters}

				{quickFilters.map((filter) => quickFilterButtons[filter])}

				<FilterPill
					$active={activeQuickFilters.size === 0}
					onClick={clearQuickFilters}
				>
					הכל ({taskRowsForCounts.length})
				</FilterPill>

				{extraButtons}
			</BarEnd>
		</BarRoot>
	)
}

const BarRoot = styled.div`
  direction: ltr;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 40px;
`

const BarStart = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`

const BarEnd = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

const ClearButton = styled.button`
  direction: rtl;
  display: flex;
  padding: 0 15px;
  justify-content: center;
  align-items: center;
  gap: 8px;
  height: 40px;
  border-radius: 8px;
  font-size: var(--fs-base);
  color: var(--text-color-2);
  cursor: pointer;
  background: var(--Components-Dropdown-Global-controlItemBgHover);
  white-space: nowrap;

  &:hover {
	background: var(--link-bg-hover);
  }
`

export const FilterPill = styled.div<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 4px;
  padding-inline: 12px;
  height: 32px;
  border-radius: 999px;
  font-size: var(--fs-btn);
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.15s;
  border: 1px solid ${({ $active }) => ($active ? "rgba(9, 88, 217, 0.6)" : "#D9D9D9")};
  background: #FFF;
  color: ${({ $active }) => ($active ? "rgba(9, 88, 217, 1)" : "var(--sea-ink)")};

  &:hover {
	background: var(--link-bg-hover);
  }
`

const FilterDivider = styled.div`
  width: 1px;
  height: 39px;
  background: var(--card-border);
`

export const FilterSeparator = styled.div`
  width: 1px;
  height: 25px;
  background: var(--Text-color-text-placeholder);
`

const WarningTrigger = styled(TooltipTrigger)`
  display: inline-flex;
  align-items: center;
  background: none;
  border: none;
  padding: 0;
  cursor: default;
  line-height: 0;
`
