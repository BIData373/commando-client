import styled from "@emotion/styled"
import type { ColumnDef, ColumnFiltersState } from "@tanstack/react-table"
import { map, uniq } from "lodash"
import { FilterX } from "lucide-react"
import { type ReactNode, useMemo } from "react"
import type { ListMessagesParams, TaskRowDto } from "src/api/model"
import type { QuickFilter } from "src/api/model/quick-filter"
import type { AppTableFeatures } from "src/consts/table-features"
import {
	countQuickFilters,
	QUICK_FILTER_LABELS,
	QUICK_FILTER_TOOLTIPS,
} from "src/utils/filter-utils"
import {
	buildCountingColumns,
	EMPTY_LIST,
	type TaskColumnMeta,
} from "src/utils/task-table-utils"
import { useHeadlessTable } from "../../hooks/useHeadlessTable"
import { useTasksFilters } from "../../providers/TasksFiltersProvider"
import SearchInput from "../shared/SearchInput"
import { ColumnVisibilityDropdown } from "../Tasks/ColumnVisibilityDropdown"
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip"
import { ExportButton, type TaskExport } from "./ExportButton"

interface TaskFiltersProps<TTask extends TaskRowDto> {
	allTaskRows: TTask[]
	filteredTasks: TTask[]
	columnOrder: (keyof TTask)[]
	hiddenColumns: Set<keyof TTask>
	onClearColumnFilters?: () => void
	extraFilters?: ReactNode
	extraButtons?: ReactNode
	extraColumns?: ColumnDef<AppTableFeatures, TTask>[]
	extraColumnsMeta?: TaskColumnMeta[]
	startSlot?: ReactNode
	urlColumnFilters?: ColumnFiltersState
	baseMessagesParams: ListMessagesParams
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
	extraColumns = EMPTY_LIST,
	extraColumnsMeta,
	startSlot,
	urlColumnFilters = EMPTY_LIST,
	extraButtons,
	baseMessagesParams,
	exportFilePrefix,
	quickFilters,
}: TaskFiltersProps<TTask>) {
	const {
		activeQuickFilters,
		toggleQuickFilter,
		clearQuickFilters,
		columnsFilters,
		resetColumnFilters,
		sorting,
		searchQuery,
		setSearchQuery,
	} = useTasksFilters()

	const hasActiveColumnFilters =
		columnsFilters.length > 0 || urlColumnFilters.length > 0

	function clearAllColumnFilters() {
		resetColumnFilters()
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

	const exportTable = useHeadlessTable({
		data: filteredTasks,
		columns: countingColumns,
		columnFilters: allColumnFilters,
		sorting,
	})

	function getExport(): TaskExport<TTask> {
		const rows = exportTable.getSortedRowModel().rows.map((row) => row.original)

		return {
			rows,
			messagesParams:
				rows.length < allTaskRows.length
					? { taskIds: uniq(map(rows, "id")) }
					: baseMessagesParams,
		}
	}

	const filteredRowsForCounts = countingTable.getFilteredRowModel().rows

	const quickFilterCounts = useMemo(
		() => countQuickFilters(filteredRowsForCounts.map((row) => row.original)),
		[filteredRowsForCounts],
	)

	function formatCount(filter: QuickFilter) {
		const count = quickFilterCounts[filter]
		return count > 0 ? ` (${count})` : ""
	}

	function renderQuickFilter(filter: QuickFilter) {
		const pill = (
			<FilterPill
				key={filter}
				$active={activeQuickFilters.has(filter)}
				onClick={() => toggleQuickFilter(filter)}
			>
				{QUICK_FILTER_LABELS[filter]}
				{formatCount(filter)}
			</FilterPill>
		)

		const tooltip = QUICK_FILTER_TOOLTIPS[filter]

		return tooltip ? (
			<Tooltip key={filter}>
				<WarningTrigger>{pill}</WarningTrigger>
				<TooltipContent>{tooltip}</TooltipContent>
			</Tooltip>
		) : (
			pill
		)
	}

	return (
		<BarRoot>
			<BarStart>
				{startSlot}

				<FilterDivider />

				<ColumnVisibilityDropdown extraColumnsMeta={extraColumnsMeta} />

				<ExportButton
					getExport={getExport}
					columnOrder={columnOrder}
					hiddenColumns={hiddenColumns}
					exportFilePrefix={exportFilePrefix}
				/>

				<TaskSearchInput
					placeholder="חפש הנחיה"
					value={searchQuery}
					onChange={setSearchQuery}
				/>
			</BarStart>

			<BarEnd>
				{extraButtons}

				<FilterPill
					$active={activeQuickFilters.size === 0}
					onClick={clearQuickFilters}
				>
					הכל ({filteredRowsForCounts.length})
				</FilterPill>

				{quickFilters.map(renderQuickFilter)}

				{extraFilters}

				{hasActiveColumnFilters && (
					<>
						<FilterSeparator />

						<ClearButton onClick={clearAllColumnFilters}>
							<FilterX size={18} />
							נקה סננים
						</ClearButton>
					</>
				)}
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
  flex-direction: row-reverse;
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

  @media (hover: hover) {
	&:hover {
		background: var(--link-bg-hover);
	}
  }
`

const TaskSearchInput = styled(SearchInput)`
  flex: none;
  width: 222px;
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
