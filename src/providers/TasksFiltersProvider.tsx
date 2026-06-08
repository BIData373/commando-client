import { useLocalStorage } from "@mantine/hooks"
import {
	createContext,
	type PropsWithChildren,
	useContext,
	useState,
} from "react"
import type {
	AssigneeDto,
	AssigneeStatusDto,
	TaskDto,
	WorkspaceStatusDto,
} from "src/api/model"
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
}

const WORKSPACE_DEFAULT_HIDDEN = new Set<TaskColumn>([
	"notes",
	"updatedAt",
] as TaskColumn[])

const TasksFiltersContext = createContext<TasksFiltersContextValue | null>(null)

type ColumnsStorageKey = "personal" | "tasks"

interface ColumnsVisibilityStorage {
	columnOrder: TaskColumn[]
	hiddenColumns: TaskColumn[]
}

interface TasksProviderProps extends PropsWithChildren {
	storageKey: ColumnsStorageKey
	defaultColumnOrder?: TaskColumn[]
	defaultHiddenColumns?: Set<TaskColumn>
}

export function formatTaskRowId(taskId: number, assigneeId?: number) {
	return `${taskId}_${assigneeId}`
}

export function TasksFiltersProvider({
	storageKey,
	defaultColumnOrder = DEFAULT_COLUMN_ORDER,
	defaultHiddenColumns = WORKSPACE_DEFAULT_HIDDEN,
	children,
}: TasksProviderProps) {
	const [searchQuery, setSearchQuery] = useState("")
	const [activeQuickFilters, setActiveQuickFilters] = useState<
		Set<QuickFilter>
	>(new Set())

	const [columnsVisibility, setColumnsVisibility] =
		useLocalStorage<ColumnsVisibilityStorage>({
			key: `${storageKey}:columnsVisibility`,
			defaultValue: {
				columnOrder: ["id" as TaskColumn, ...defaultColumnOrder],
				hiddenColumns: [...defaultHiddenColumns],
			},
		})

	const columnOrder = columnsVisibility.columnOrder
	const hiddenColumns = new Set<TaskColumn>(columnsVisibility.hiddenColumns)

	function setColumnOrder(order: TaskColumn[]) {
		setColumnsVisibility((prev) => ({ ...prev, columnOrder: order }))
	}

	function toggleColumn(columnId: TaskColumn) {
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
