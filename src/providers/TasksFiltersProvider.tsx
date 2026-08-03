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
import type { TaskRowWithWorkspaceDto } from "src/api/model"
import { DATE_TYPE } from "src/utils/date-utils"
import {
	dashboardFilterDataTypeKey,
	dashboardFilterRangeKey,
	type QuickFilter,
} from "src/utils/filter-utils"
import {
	DEFAULT_COLUMN_ORDER,
	reconcileColumnOrder,
} from "src/utils/task-table-utils"

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

const WORKSPACE_DEFAULT_HIDDEN = new Set<keyof TaskRowWithWorkspaceDto>([
	"notes",
	"updatedAt",
] as (keyof TaskRowWithWorkspaceDto)[])

const TasksFiltersContext = createContext<TasksFiltersContextValue | null>(null)

type ColumnsStorageKey =
	| "personal"
	| "tasks"
	| "dashboard"
	| "personal-archive"
	| "workspace-archive"

interface ColumnsVisibilityStorage {
	columnOrder: (keyof TaskRowWithWorkspaceDto)[]
	hiddenColumns: (keyof TaskRowWithWorkspaceDto)[]
}

interface TasksFiltersProviderProps extends PropsWithChildren {
	storageKey: ColumnsStorageKey
	defaultColumnOrder?: (keyof TaskRowWithWorkspaceDto)[]
	defaultHiddenColumns?: Set<keyof TaskRowWithWorkspaceDto>
	activeQuickFilters?: Set<QuickFilter>
}

export function TasksFiltersProvider({
	storageKey,
	defaultColumnOrder = DEFAULT_COLUMN_ORDER,
	defaultHiddenColumns = WORKSPACE_DEFAULT_HIDDEN,
	activeQuickFilters: currentActiveQuickFilters = new Set(),
	children,
}: TasksFiltersProviderProps) {
	const [searchQuery, setSearchQuery] = useState("")
	const [activeQuickFilters, setActiveQuickFilters] = useState<
		Set<QuickFilter>
	>(currentActiveQuickFilters)
	const [columnsFilters, setColumnsFilters] = useState<ColumnFiltersState>([])
	const [sorting, setSorting] = useState<SortingState>([])

	const knownColumnIds = useMemo(
		() => ["id" as keyof TaskRowWithWorkspaceDto, ...defaultColumnOrder],
		[defaultColumnOrder],
	)
	const [columnsVisibility, setColumnsVisibility] =
		useLocalStorage<ColumnsVisibilityStorage>({
			key: `${storageKey}:columnsVisibility`,
			defaultValue: {
				columnOrder: knownColumnIds,
				hiddenColumns: [...defaultHiddenColumns],
			},
		})

	const columnOrder = useMemo(
		() => reconcileColumnOrder(columnsVisibility.columnOrder, knownColumnIds),
		[columnsVisibility.columnOrder, knownColumnIds],
	)

	const hiddenColumns = useMemo(
		() =>
			new Set<keyof TaskRowWithWorkspaceDto>(columnsVisibility.hiddenColumns),
		[columnsVisibility.hiddenColumns],
	)

	function setColumnOrder(order: (keyof TaskRowWithWorkspaceDto)[]) {
		setColumnsVisibility((prev) => ({ ...prev, columnOrder: order }))
	}

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

	function toggleColumn(columnId: keyof TaskRowWithWorkspaceDto) {
		setColumnsVisibility((prev) => {
			const set = new Set(prev.hiddenColumns)
			if (set.has(columnId)) {
				set.delete(columnId)
			} else {
				set.add(columnId)
			}
			return { ...prev, hiddenColumns: [...set] }
		})
	}

	function toggleQuickFilter(filter: QuickFilter) {
		setActiveQuickFilters((prev) => {
			const next = new Set(prev)
			if (next.has(filter)) {
				next.delete(filter)
			} else {
				next.add(filter)
			}
			return next
		})
	}

	function clearQuickFilters() {
		setActiveQuickFilters(new Set())
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
				columnsFilters,
				setColumnsFilters,
				sorting,
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
