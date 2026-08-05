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
	const [localQuickFilters, setLocalQuickFilters] = useState<
		Set<QuickFilter> | undefined
	>(initialQuickFilters)
	const { columnVisibility, quickFilter, columnFilters, sorting } = view.table
	const { columnOrder: columnOrderRaw, hiddenColumns: hiddenColumnsRaw } =
		columnVisibility as {
			columnOrder: (keyof TaskRowWithWorkspaceDto)[]
			hiddenColumns: (keyof TaskRowWithWorkspaceDto)[]
		}

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

	const knownColumnIds: (keyof TaskRowWithWorkspaceDto)[] = useMemo(
		() => ["id", ...new Set([...DEFAULT_COLUMN_ORDER, ...columnOrderRaw])],
		[columnOrderRaw],
	)

	const activeQuickFilters = useMemo(
		() => localQuickFilters ?? new Set<QuickFilter>(quickFilter),
		[localQuickFilters, quickFilter],
	)

	const columnOrder = useMemo(
		() => reconcileColumnOrder(columnOrderRaw, knownColumnIds),
		[columnOrderRaw, knownColumnIds],
	)

	const hiddenColumns = useMemo(
		() => new Set(hiddenColumnsRaw),
		[hiddenColumnsRaw],
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

		setLocalQuickFilters(undefined)
		updateTableView({
			quickFilter: [...nextQuickFilters],
		})
	}

	function clearQuickFilters() {
		setLocalQuickFilters(undefined)
		updateTableView({
			quickFilter: [],
		})
	}

	function setColumnsFilters(columnsFilters: ColumnFiltersState) {
		updateTableView({
			columnFilters: columnsFilters as ColumnFilterDto[],
		})
	}

	const setSorting: Dispatch<SetStateAction<SortingState>> = (value) => {
		const nextSorting = typeof value === "function" ? value(sorting) : value

		updateTableView({
			sorting: nextSorting,
		})
	}

	function setColumnOrder(order: (keyof TaskRowWithWorkspaceDto)[]) {
		updateTableView({
			columnVisibility: {
				...columnVisibility,
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
				...columnVisibility,
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
				columnsFilters: columnFilters,
				setColumnsFilters,
				sorting: sorting,
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
