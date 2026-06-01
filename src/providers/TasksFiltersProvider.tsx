import {
  createContext,
  type PropsWithChildren,
  useContext,
  useState
} from "react";
import type { AssigneeDto, AssigneeStatusDto, TaskDto, WorkspaceStatusDto } from "src/api/model";
import type { QuickFilter } from "src/utils/filter-utils";
import { DEFAULT_COLUMN_ORDER } from "../components/Tasks/ColumnVisibilityDropdown";
import type { TaskColumn } from "../hooks/useTaskColumns";

// TODO:
// - remove the CRUD helpers (make it happen in the actual place)
// - rename to TasksFiltersProvider
// - see what we can offload to tanstack

export type NewTaskInput = Omit<TaskDto, "id" | "createdAt" | "updatedAt"> & {
  groupKey?: string;
};

export type TaskRow = TaskDto & {
  rowKey: string;
  assignee: AssigneeDto;
  status: WorkspaceStatusDto;
  otherAssignees: AssigneeStatusDto[];
}

interface TasksFiltersContextValue {
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  activeQuickFilters: Set<QuickFilter>;
  toggleQuickFilter: (filter: QuickFilter) => void;
  clearQuickFilters: () => void;

  columnOrder: TaskColumn[];
  hiddenColumns: Set<TaskColumn>;
  setColumnOrder: (order: TaskColumn[]) => void;
  toggleColumn: (columnId: TaskColumn) => void;
}

const WORKSPACE_DEFAULT_HIDDEN = new Set<TaskColumn>([
  "notes",
  "updatedAt",
] as TaskColumn[]);

const TasksFiltersContext = createContext<TasksFiltersContextValue | null>(null);

interface TasksProviderProps extends PropsWithChildren {
  defaultColumnOrder?: TaskColumn[];
  defaultHiddenColumns?: Set<TaskColumn>;
}

export function formatTaskRowId(taskId: number, assigneeId: number) {
  return `${taskId}_${assigneeId}`
}

export function TasksFiltersProvider({
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

  // function setTasks(updater: Updater<TTask[] | undefined, TTask[] | undefined>) {
  //   queryClient.setQueryData(queryKey, updater)
  // }

  // function updateTaskStatus(taskId: number, assigneeId: number, status: DirectiveStatus) {
  //   if (!queryKey) return;
  //   queryClient.setQueryData(queryKey, (prev: TTask[] | undefined) =>
  //     prev?.map((task) => {
  //       if (task.id !== taskId) return task;
  //       const t = task as TaskWithAssignees;
  //       return {
  //         ...task,
  //         assignees: t.assignees?.map((e) =>
  //           e.assignee.id === assigneeId ? { ...e, status } : e,
  //         ),
  //       } as TTask;
  //     }),
  //   );
  // }

  // function removeTasks(taskIds: number[]) {
  //   if (!queryKey) return;
  //   queryClient.setQueryData(queryKey, (prev: TTask[] | undefined) =>
  //     prev?.filter((t) => !taskIds.includes(t.id)),
  //   );
  // }

  // // FIX Move to TaskTable
  // function bulkUpdateStatus(taskIds: number[], status: DirectiveStatus) {
  //   if (!queryKey) return;
  //   queryClient.setQueryData(queryKey, (prev: TTask[] | undefined) =>
  //     prev?.map((task) => {
  //       if (!taskIds.includes(task.id)) return task;
  //       const t = task as TaskWithAssignees;
  //       return {
  //         ...task,
  //         assignees: t.assignees?.map((e) => ({ ...e, status })),
  //       } as TTask;
  //     }),
  //   );
  // }

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
        toggleColumn
      }}
    >
      {children}
    </TasksFiltersContext.Provider>
  );
}

export function useTasksFilters() {
  const ctx = useContext(TasksFiltersContext);
  if (!ctx) {
    throw new Error("`useTasksFilters` must be used within a `TasksProvider`");
  }
  return ctx;
}
