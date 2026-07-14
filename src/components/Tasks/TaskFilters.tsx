import styled from "@emotion/styled"
import type { ColumnFiltersState } from "@tanstack/react-table"
import { Download, FilterX, Search, X } from "lucide-react"
import { type ReactNode, useCallback, useMemo } from "react"
import type { TaskRowDto } from "src/api/model"
import { exportTasksToExcel } from "src/functions/export-excel"
import { matchesQuickFilter } from "src/functions/filter-utils"
import { QuickFilter } from "src/utils/filter-utils"
import {
	filterByTaskColumns,
	sortByTaskColumns,
	type TaskColumnMeta,
} from "src/utils/task-table-utils"
import { useTasksFilters } from "../../providers/TasksFiltersProvider"
import { ColumnVisibilityDropdown } from "../Tasks/ColumnVisibilityDropdown"
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip"

interface TaskFiltersProps<TTask extends TaskRowDto> {
	allTaskRows: TTask[]
	filteredTaskRows: TTask[]
	columnOrder: (keyof TTask)[]
	hiddenColumns: Set<keyof TTask>
	onClearColumnFilters?: () => void
	onClearQuickFilters?: () => void
	extraFilters?: ReactNode
	extraButtons?: ReactNode
	extraColumnsMeta?: TaskColumnMeta[]
	tabFilter?: QuickFilter[]
	onToggleTabFilter?: (filter: QuickFilter) => void
	startSlot?: ReactNode
	urlColumnFilters?: ColumnFiltersState
	exportFilePrefix?: string
}

export function TaskFilters<TTask extends TaskRowDto>({
	allTaskRows,
	filteredTaskRows,
	columnOrder,
	hiddenColumns,
	onClearColumnFilters,
	onClearQuickFilters,
	extraFilters,
	extraColumnsMeta,
	tabFilter,
	onToggleTabFilter,
	startSlot,
	urlColumnFilters = [],
	extraButtons,
	exportFilePrefix,
}: TaskFiltersProps<TTask>) {
	const {
		activeQuickFilters,
		toggleQuickFilter,
		clearQuickFilters,
		columnsFilters,
		setColumnsFilters,
		sorting,
		searchQuery,
		setSearchQuery,
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

	const allColumnFilters = useMemo(
		() => [...urlColumnFilters, ...columnsFilters],
		[urlColumnFilters, columnsFilters],
	)

	const taskRowsForCounts = filterByTaskColumns(allTaskRows, allColumnFilters)

	const overdueCount = taskRowsForCounts.filter((t) =>
		matchesQuickFilter(t, QuickFilter.OVERDUE),
	).length

	const approachingCount = taskRowsForCounts.filter((t) =>
		matchesQuickFilter(t, QuickFilter.APPROACHING),
	).length

	const flaggedCount = taskRowsForCounts.filter((t) =>
		matchesQuickFilter(t, QuickFilter.FLAGGED),
	).length

	const handleExport = useCallback(() => {
		exportTasksToExcel(
			sortByTaskColumns(
				filterByTaskColumns(filteredTaskRows, allColumnFilters),
				sorting,
			),
			columnOrder,
			hiddenColumns,
			exportFilePrefix,
		)
	}, [
		filteredTaskRows,
		columnOrder,
		hiddenColumns,
		sorting,
		allColumnFilters,
		exportFilePrefix,
	])

	return (
		<BarRoot>
			<BarStart>
				{startSlot}

				<FilterDivider />

				<ColumnVisibilityDropdown extraColumnsMeta={extraColumnsMeta} />

				<ActionButton onClick={handleExport}>
					<Download size={18} />
				</ActionButton>

				<SearchInputWrapper>
					<SearchField
						placeholder="חפש הנחייה"
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
					/>

					<SearchIconBox>
						{searchQuery ? (
							<ClearIcon size={14} onClick={() => setSearchQuery("")} />
						) : (
							<SearchIcon size={16} />
						)}
					</SearchIconBox>
				</SearchInputWrapper>
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

const ActionButton = styled.button`
  display: flex;
  padding: 0 15px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 8px;
  height: 40px;
  border-radius: 8px;
  border: 1px solid var(--card-border);
  background: var(--background);
  box-shadow: var(--shadow-button);
  cursor: pointer;
  white-space: nowrap;

  &:hover {
	background: var(--link-bg-hover);
  }
`

const SearchInputWrapper = styled.div`
  direction: rtl;
  display: flex;
  align-items: center;
  height: 40px;
  width: 222px;
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  background: white;
  overflow: hidden;
  box-shadow: 0px 2px 0px 0px rgba(0, 0, 0, 0.02);

  &:focus-within {
	border-color: rgba(9, 88, 217, 0.6);
  }
`

const SearchIconBox = styled.div`
  display: flex;
  width: 32px;
  height: 32px;
  justify-content: center;
  align-items: center;
`

const SearchIcon = styled(Search)`
  color: rgba(0, 0, 0, 0.25);
  animation: scale-in 0.15s ease;
`

const ClearIcon = styled(X)`
  color: white;
  cursor: pointer;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 50%;
  padding: 2px;
  animation: scale-in 0.15s ease;

  &:hover {
	background: rgba(0, 0, 0, 0.35);
  }
`

const SearchField = styled.input`
  flex: 1;
  height: 100%;
  border: none;
  outline: none;
  background: transparent;
  font-size: var(--fs-btn);
  font-weight: 400;
  line-height: 22px;
  color: var(--text-color-2);
  padding: 0 11px 0 0;
  text-align: right;
  direction: rtl;

  &::placeholder {
	color: var(--Text-color-text-placeholder);
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
