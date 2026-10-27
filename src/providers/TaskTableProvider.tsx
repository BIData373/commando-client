import {
	createContext,
	type PropsWithChildren,
	useContext,
	useLayoutEffect,
	useMemo,
	useRef,
} from "react"
import type { WorkspaceStatusDto } from "src/api/model"
import type { TaskRowHandlers } from "src/functions/row-actions"
import { useUpdateTaskStatus } from "src/hooks/useUpdateTaskStatus"
import type { FilterOption, FilterOptions } from "src/utils/filter-utils"

interface TaskTableHandlers extends TaskRowHandlers {
	onUpdateStatus: ReturnType<typeof useUpdateTaskStatus>
}

interface TaskTableContextValue {
	searchQuery: string
	statuses?: WorkspaceStatusDto[]
	filterOptionsMap?: Record<FilterOptions, FilterOption[]>
	titleExpanded: boolean
	onToggleTitleExpanded(): void
	getHandlers(): TaskTableHandlers
}

interface TaskTableProviderProps extends PropsWithChildren {
	searchQuery?: string
	statuses?: WorkspaceStatusDto[]
	filterOptionsMap?: Record<FilterOptions, FilterOption[]>
	titleExpanded?: boolean
	onToggleTitleExpanded?(): void
	handlers?: TaskRowHandlers
}

const TaskTableContext = createContext<TaskTableContextValue | null>(null)

export function TaskTableProvider({
	searchQuery = "",
	statuses,
	filterOptionsMap,
	titleExpanded = false,
	onToggleTitleExpanded = () => {},
	handlers,
	children,
}: TaskTableProviderProps) {
	const onUpdateStatus = useUpdateTaskStatus({ notify: true })
	const handlersRef = useRef<TaskTableHandlers>({ ...handlers, onUpdateStatus })

	useLayoutEffect(() => {
		handlersRef.current = { ...handlers, onUpdateStatus }
	})

	// Every mounted cell consumes this value, so it changes only with what cells render.
	// Handlers are recreated by callers each render and are read through `getHandlers` instead.
	const value = useMemo(
		() => ({
			searchQuery,
			statuses,
			filterOptionsMap,
			titleExpanded,
			onToggleTitleExpanded,
			getHandlers: () => handlersRef.current,
		}),
		[
			searchQuery,
			statuses,
			filterOptionsMap,
			titleExpanded,
			onToggleTitleExpanded,
		],
	)

	return (
		<TaskTableContext.Provider value={value}>
			{children}
		</TaskTableContext.Provider>
	)
}

export function useTaskTable() {
	const ctx = useContext(TaskTableContext)
	if (!ctx) {
		throw new Error("`useTaskTable` must be used within a `TaskTableProvider`")
	}
	return ctx
}
