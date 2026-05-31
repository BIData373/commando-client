import type { Updater } from "@tanstack/react-query";
import {
	createContext,
	type PropsWithChildren,
	useCallback,
	useContext,
	useState
} from "react";
import type { AssigneeStatusDto, TaskDto } from "src/api/model";
import { queryClient } from "src/queryClient";
import type { QuickFilter } from "src/utils/filterUtils";
import { DirectiveStatus } from "src/utils/statusUtils";
import { DEFAULT_COLUMN_ORDER } from "../components/Tasks/ColumnVisibilityDropdown";
import type { RelatedDirective } from "../components/Tasks/ResponsibleCell";
import { applyAllFilters } from "../functions/filter-utils";
import type { TaskColumn } from "../hooks/useTaskColumns";

export type NewTaskInput = Omit<TaskDto, "id" | "createdAt" | "updatedAt"> & {
	groupKey?: string;
};

export type TaskRow<TTask extends TaskDto> = Omit<TTask, 'assigneeStatuses'> & {
	rowKey: string;
	assigneeId: number;
	statusId: number;
	otherAssignees: AssigneeStatusDto[];
}

interface TasksContextValue {
	updateTaskStatus: (taskId: number, assigneeId: number, status: DirectiveStatus) => void;
	removeTasks: (taskIds: number[]) => void;
	bulkUpdateStatus: (taskIds: number[], status: DirectiveStatus) => void;
	searchQuery: string;
	setSearchQuery: (query: string) => void;
	activeQuickFilters: Set<QuickFilter>;
	toggleQuickFilter: (filter: QuickFilter) => void;
	clearQuickFilters: () => void;
	columnOrder: TaskColumn[];
	setColumnOrder: (order: TaskColumn[]) => void;
	hiddenColumns: Set<TaskColumn>;
	toggleColumn: (columnId: TaskColumn) => void;
}

const WORKSPACE_DEFAULT_HIDDEN = new Set<TaskColumn>([
	"notes",
	"updatedAt",
] as TaskColumn[]);

const TasksContext = createContext<TasksContextValue | null>(null);

type TaskWithAssignees = TaskDto & { assignees?: RelatedDirective[] };

interface TasksProviderProps extends PropsWithChildren {
	defaultColumnOrder?: TaskColumn[];
	defaultHiddenColumns?: Set<TaskColumn>;
}

export function formatTaskRowId(taskId: number, assigneeId: number) {
	return `${taskId}_${assigneeId}`
}

export function TasksProvider({
	defaultColumnOrder = DEFAULT_COLUMN_ORDER,
	defaultHiddenColumns = WORKSPACE_DEFAULT_HIDDEN,
	children,
}: TasksProviderProps) {
	const [searchQuery, setSearchQuery] = useState("");
	const [activeQuickFilters, setActiveQuickFilters] = useState<
		Set<QuickFilter>
	>(new Set());
	const [columnOrder, setColumnOrder] = useState<TaskColumn[]>([
		"id" as TaskColumn,
		...defaultColumnOrder,
	]);
	const [hiddenColumns, setHiddenColumns] =
		useState<Set<TaskColumn>>(defaultHiddenColumns);

	const taskRows = useCallback(<TTask extends TaskDto>(tasks: TTask) =>
		applyAllFilters(tasks, activeQuickFilters, new Set(), searchQuery)
			.flatMap(({ id, assigneeStatuses, ...task }) => (
				assigneeStatuses.map(({ assigneeId, statusId }) => ({
					...task,
					id,
					rowKey: formatTaskRowId(id, assigneeId),
					assigneeId,
					statusId,
					otherAssignees: assigneeStatuses.filter((assigneeStatus) => (
						assigneeStatus.assigneeId !== assigneeId
					))
				}))
			)),
		[searchQuery, activeQuickFilters]
	)

	function toggleColumn(columnId: TaskColumn) {
		setHiddenColumns((prev) => {
			const next = new Set(prev);
			if (next.has(columnId)) {
				next.delete(columnId);
			} else {
				next.add(columnId);
			}
			return next;
		});
	}

	function toggleQuickFilter(filter: QuickFilter) {
		setActiveQuickFilters((prev) => {
			const next = new Set(prev);
			if (next.has(filter)) {
				next.delete(filter);
			} else {
				next.add(filter);
			}
			return next;
		});
	}

	function clearQuickFilters() {
		setActiveQuickFilters(new Set());
	}

	function setTasks(updater: Updater<TTask[] | undefined, TTask[] | undefined>) {
		queryClient.setQueryData(queryKey, updater)
	}

	function updateTaskStatus(taskId: number, assigneeId: number, status: DirectiveStatus) {
		if (!queryKey) return;
		queryClient.setQueryData(queryKey, (prev: TTask[] | undefined) =>
			prev?.map((task) => {
				if (task.id !== taskId) return task;
				const t = task as TaskWithAssignees;
				return {
					...task,
					assignees: t.assignees?.map((e) =>
						e.assignee.id === assigneeId ? { ...e, status } : e,
					),
				} as TTask;
			}),
		);
	}

	function removeTasks(taskIds: number[]) {
		if (!queryKey) return;
		queryClient.setQueryData(queryKey, (prev: TTask[] | undefined) =>
			prev?.filter((t) => !taskIds.includes(t.id)),
		);
	}

	// FIX Move to TaskTable
	function bulkUpdateStatus(taskIds: number[], status: DirectiveStatus) {
		if (!queryKey) return;
		queryClient.setQueryData(queryKey, (prev: TTask[] | undefined) =>
			prev?.map((task) => {
				if (!taskIds.includes(task.id)) return task;
				const t = task as TaskWithAssignees;
				return {
					...task,
					assignees: t.assignees?.map((e) => ({ ...e, status })),
				} as TTask;
			}),
		);
	}

	return (
		<TasksContext.Provider
			value={{
				updateTaskStatus,
				removeTasks,
				bulkUpdateStatus,
				searchQuery,
				setSearchQuery,
				activeQuickFilters,
				toggleQuickFilter,
				clearQuickFilters,
				columnOrder,
				setColumnOrder,
				hiddenColumns,
				toggleColumn
			}}
		>
			{children}
		</TasksContext.Provider>
	);
}

export function useTasks() {
	const ctx = useContext(TasksContext);
	if (!ctx) throw new Error("useTasks must be used within a TasksProvider");
	return ctx;
}
