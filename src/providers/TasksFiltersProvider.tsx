import { useLocalStorage } from "@mantine/hooks"
import type { ColumnFiltersState, SortingState } from "@tanstack/react-table"
import {
	createContext,
	type Dispatch,
	type PropsWithChildren,
	type SetStateAction,
	useContext,
	useMemo,
	useState,
} from "react"
import type { DateRange } from "react-day-picker"
import type {
	ColumnFilterDto,
	QuickFilter,
	TaskRowWithWorkspaceDto,
	UserViewDto,
} from "src/api/model"
import { DATE_TYPE } from "src/utils/date-utils"
import {
	dashboardFilterDataTypeKey,
	dashboardFilterRangeKey,
} from "src/utils/filter-utils"
import {
	DEFAULT_COLUMN_ORDER,
	reconcileColumnOrder,
} from "src/utils/task-table-utils"
import { useUserView } from "./UserViewProvider"

interface TasksFiltersContextValue {
	searchQuery: string
	setSearchQuery: (query: string) => void

	activeQuickFilters: Set<QuickFilter>
	toggleQuickFilter: (filter: QuickFilter) => void
	clearQuickFilters: () => void

	columnOrder: (keyof TaskRowWithWorkspaceDto)[]
	hiddenColumns: Set<keyof TaskRowWithWorkspaceDto>
	setColumnOrder: (order: (keyof TaskRowWithWorkspaceDto)[]) => void
	toggleColumn: (columnId: keyof TaskRowWithWorkspaceDto) => void

	dateType: DATE_TYPE
	setDateType: (type: DATE_TYPE) => void
	dateRange: DateRange | undefined
	setDateRange: (range: DateRange | undefined) => void

	columnsFilters: ColumnFiltersState
	setColumnsFilters(columnsFilters: ColumnFiltersState): void

	sorting: SortingState
	setSorting: Dispatch<SetStateAction<SortingState>>
}

const TasksFiltersContext = createContext<TasksFiltersContextValue | null>(null)

interface TasksFiltersProviderProps extends PropsWithChildren {
	initialQuickFilters?: Set<QuickFilter>
}

export function TasksFiltersProvider({
	initialQuickFilters,
	children,
}: TasksFiltersProviderProps) {
	const { view, updateView } = useUserView()

	const [quickFilterOverride, setQuickFilterOverride] = useState<
		Set<QuickFilter> | undefined
	>(initialQuickFilters)

	const [searchQuery, setSearchQuery] = useState("")

	const [dateType, setDateType] = useLocalStorage<DATE_TYPE>({
		key: dashboardFilterDataTypeKey,
		defaultValue: DATE_TYPE.CREATION_DATE,
	})

	const [dateRange, setDateRange] = useLocalStorage<DateRange | undefined>({
		key: dashboardFilterRangeKey,
		defaultValue: undefined,
		deserialize: (raw) => {
			if (!raw) return undefined
			try {
				const parsed = JSON.parse(raw)
				if (!parsed) return undefined
				return {
					from: parsed.from ? new Date(parsed.from) : undefined,
					to: parsed.to ? new Date(parsed.to) : undefined,
				}
			} catch {
				return undefined
			}
		},
	})

	const tableView = view.table

	const knownColumnIds = useMemo(
		() =>
			[
				"id" as keyof TaskRowWithWorkspaceDto,
				...new Set([
					...DEFAULT_COLUMN_ORDER,
					...(tableView.columnVisibility
						.columnOrder as (keyof TaskRowWithWorkspaceDto)[]),
				]),
			] as (keyof TaskRowWithWorkspaceDto)[],
		[tableView.columnVisibility.columnOrder],
	)

	const activeQuickFilters = useMemo(
		() => quickFilterOverride ?? new Set<QuickFilter>(tableView.quickFilter),
		[quickFilterOverride, tableView.quickFilter],
	)

	const columnOrder = useMemo(
		() =>
			reconcileColumnOrder(
				tableView.columnVisibility
					.columnOrder as (keyof TaskRowWithWorkspaceDto)[],
				knownColumnIds,
			),
		[tableView.columnVisibility.columnOrder, knownColumnIds],
	)

	const hiddenColumns = useMemo(
		() =>
			new Set<keyof TaskRowWithWorkspaceDto>(
				tableView.columnVisibility
					.hiddenColumns as (keyof TaskRowWithWorkspaceDto)[],
			),
		[tableView.columnVisibility.hiddenColumns],
	)

	const updateTableView = (update: Partial<UserViewDto["table"]>) => {
		const nextView: UserViewDto = {
			...view,
			table: {
				...view.table,
				...update,
			},
		}
		updateView(nextView)
	}

	function toggleQuickFilter(filter: QuickFilter) {
		const nextQuickFilters = new Set(activeQuickFilters)

		if (nextQuickFilters.has(filter)) {
			nextQuickFilters.delete(filter)
		} else {
			nextQuickFilters.add(filter)
		}

		setQuickFilterOverride(undefined)
		updateTableView({
			quickFilter: [...nextQuickFilters],
		})
	}

	function clearQuickFilters() {
		setQuickFilterOverride(undefined)
		updateTableView({
			quickFilter: [],
		})
	}

	function setColumnsFilters(columnsFilters: ColumnFiltersState) {
		console.log("columnsFilters", columnsFilters)
		updateTableView({
			columnFilters: columnsFilters as ColumnFilterDto[],
		})
	}

	const setSorting: Dispatch<SetStateAction<SortingState>> = (value) => {
		const nextSorting =
			typeof value === "function" ? value(tableView.sorting) : value

		updateTableView({
			sorting: nextSorting,
		})
	}

	function setColumnOrder(order: (keyof TaskRowWithWorkspaceDto)[]) {
		updateTableView({
			columnVisibility: {
				...tableView.columnVisibility,
				columnOrder: order,
			},
		})
	}

	function toggleColumn(columnId: keyof TaskRowWithWorkspaceDto) {
		const nextHiddenColumns = new Set(hiddenColumns)

		if (nextHiddenColumns.has(columnId)) {
			nextHiddenColumns.delete(columnId)
		} else {
			nextHiddenColumns.add(columnId)
		}

		updateTableView({
			columnVisibility: {
				...tableView.columnVisibility,
				hiddenColumns: [...nextHiddenColumns],
			},
		})
	}
	return (
		<TasksFiltersContext.Provider
			value={{
				searchQuery,
				setSearchQuery,
				activeQuickFilters,
				toggleQuickFilter,
				clearQuickFilters,
				columnOrder,
				setColumnOrder,
				hiddenColumns,
				toggleColumn,
				dateType,
				setDateType,
				dateRange,
				setDateRange,
				columnsFilters: tableView.columnFilters,
				setColumnsFilters,
				sorting: tableView.sorting,
				setSorting,
			}}
		>
			{children}
		</TasksFiltersContext.Provider>
	)
}

export function useTasksFilters() {
	const ctx = useContext(TasksFiltersContext)
	if (!ctx) {
		throw new Error(
			"`useTasksFilters` must be used within a `TasksFiltersProvider`",
		)
	}
	return ctx
}
