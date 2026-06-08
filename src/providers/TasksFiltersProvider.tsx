import { useLocalStorage } from "@mantine/hooks"
import {
	createContext,
	type PropsWithChildren,
	useContext,
	useState,
} from "react"
import type { DateRange } from "react-day-picker"
import type {
	AssigneeDto,
	AssigneeStatusDto,
	TaskDto,
	WorkspaceStatusDto,
} from "src/api/model"
import { DATE_TYPE } from "src/utils/data-type-utils"
import {
	dashboardFilterDataTypeKey,
	dashboardFilterRangeKey,
} from "src/utils/filter-keys-utils"
import type { QuickFilter } from "src/utils/filter-utils"
import { DEFAULT_COLUMN_ORDER } from "../components/Tasks/ColumnVisibilityDropdown"
import type { TaskColumn } from "../hooks/useTaskColumns"

export type NewTaskInput = Omit<TaskDto, "id" | "createdAt" | "updatedAt"> & {
	groupKey?: string
}

export type TaskRow = TaskDto & {
	rowKey: string
	assignee?: AssigneeDto
	status?: WorkspaceStatusDto
	otherAssignees?: AssigneeStatusDto[]
}

interface TasksFiltersContextValue {
	searchQuery: string
	setSearchQuery: (query: string) => void

	activeQuickFilters: Set<QuickFilter>
	toggleQuickFilter: (filter: QuickFilter) => void
	clearQuickFilters: () => void

	columnOrder: TaskColumn[]
	hiddenColumns: Set<TaskColumn>
	setColumnOrder: (order: TaskColumn[]) => void
	toggleColumn: (columnId: TaskColumn) => void

	dateType: DATE_TYPE
	setDateType: (type: DATE_TYPE) => void
	dateRange: DateRange | undefined
	setDateRange: (range: DateRange | undefined) => void
}

const WORKSPACE_DEFAULT_HIDDEN = new Set<TaskColumn>([
	"notes",
	"updatedAt",
] as TaskColumn[])

const TasksFiltersContext = createContext<TasksFiltersContextValue | null>(null)

interface TasksProviderProps extends PropsWithChildren {
	defaultColumnOrder?: TaskColumn[]
	defaultHiddenColumns?: Set<TaskColumn>
}

export function formatTaskRowId(taskId: number, assigneeId?: number) {
	return `${taskId}_${assigneeId}`
}

export function TasksFiltersProvider({
	defaultColumnOrder = DEFAULT_COLUMN_ORDER,
	defaultHiddenColumns = WORKSPACE_DEFAULT_HIDDEN,
	children,
}: TasksProviderProps) {
	const [searchQuery, setSearchQuery] = useState("")
	const [activeQuickFilters, setActiveQuickFilters] = useState<
		Set<QuickFilter>
	>(new Set())
	const [columnOrder, setColumnOrder] = useState<TaskColumn[]>([
		"id" as TaskColumn,
		...defaultColumnOrder,
	])
	const [hiddenColumns, setHiddenColumns] =
		useState<Set<TaskColumn>>(defaultHiddenColumns)

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

	function toggleColumn(columnId: TaskColumn) {
		setHiddenColumns((prev) => {
			const next = new Set(prev)
			if (next.has(columnId)) {
				next.delete(columnId)
			} else {
				next.add(columnId)
			}
			return next
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
			}}
		>
			{children}
		</TasksFiltersContext.Provider>
	)
}

export function useTasksFilters() {
	const ctx = useContext(TasksFiltersContext)
	if (!ctx) {
		throw new Error("`useTasksFilters` must be used within a `TasksProvider`")
	}
	return ctx
}
