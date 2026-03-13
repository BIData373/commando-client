import type { ColumnFilterOptions } from '../components/environment/InstructionsTable/InstructionsTable';
import type { QuickFilterType, TablePreferences } from '../hooks/useTablePreferences';
import type { IInstructionListItem } from '../types';
import { STATUS_LABELS } from '../types';

type QuickFilterFn = (item: IInstructionListItem, now: Date) => boolean;

const QUICK_FILTER_MAP: Record<QuickFilterType, QuickFilterFn> = {
  all: (item) => item.status !== 'archived',
  archived: (item) => item.status === 'archived',
  overdue: (item, now) =>
    item.status !== 'archived' &&
    item.status !== 'completed' &&
    !!item.dueDate &&
    new Date(item.dueDate).getTime() < now.getTime(),
  routine: (item) => item.status !== 'archived' && item.dueDateType === 'routine',
  important: (item) =>
    item.status !== 'archived' &&
    (item.priority === 'high' || item.priority === 'urgent' || item.isImportant),
};

export function applyQuickFilter(
  items: IInstructionListItem[],
  quickFilter: QuickFilterType
): IInstructionListItem[] {
  const now = new Date();
  const filterFn = QUICK_FILTER_MAP[quickFilter] ?? QUICK_FILTER_MAP.all;
  return items.filter((item) => filterFn(item, now));
}

export function applyColumnFilters(
  items: IInstructionListItem[],
  columnFilters: Record<string, string[]>
): IInstructionListItem[] {
  let result = items;
  if (columnFilters.assignees?.length) {
    result = result.filter((i) =>
      i.assignees.some((a) => columnFilters.assignees.includes(a.user.id))
    );
  }
  if (columnFilters.dueDate?.length) {
    result = result.filter((i) => columnFilters.dueDate.includes(i.dueDateType));
  }
  if (columnFilters.status?.length) {
    result = result.filter((i) => columnFilters.status.includes(i.status));
  }
  return result;
}

export function applySearch(items: IInstructionListItem[], query: string): IInstructionListItem[] {
  const q = query.trim().toLowerCase();
  if (!q) return items;
  return items.filter((i) => {
    const titleMatch = i.title.toLowerCase().includes(q);
    const sourceMatch = i.source?.toLowerCase().includes(q);
    const assigneeMatch = i.assignees.some((a) => a.user.name.toLowerCase().includes(q));
    return titleMatch || sourceMatch || assigneeMatch;
  });
}

export function sortInstructions(
  items: IInstructionListItem[],
  sortColumn: string | null,
  sortDirection: 'asc' | 'desc' | null
): IInstructionListItem[] {
  if (!sortColumn || !sortDirection) {
    return [...items].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }
  return [...items].sort((a, b) => {
    const aVal = a[sortColumn as keyof IInstructionListItem];
    const bVal = b[sortColumn as keyof IInstructionListItem];
    if (aVal === null || aVal === undefined) return 1;
    if (bVal === null || bVal === undefined) return -1;

    const compare = String(aVal).localeCompare(String(bVal), 'he');
    return sortDirection === 'desc' ? -compare : compare;
  });
}

export function applyAllFilters(
  items: IInstructionListItem[],
  preferences: TablePreferences,
  searchQuery: string
): IInstructionListItem[] {
  const filtered = applyQuickFilter(items, preferences.quickFilter);
  const columnFiltered = applyColumnFilters(filtered, preferences.columnFilters);
  const searched = applySearch(columnFiltered, searchQuery);
  return sortInstructions(searched, preferences.sortColumn, preferences.sortDirection);
}

export function buildFilterOptions(items: IInstructionListItem[]): ColumnFilterOptions {
  const assigneeMap = new Map<string, string>();
  items.forEach((i) => {
    i.assignees.forEach((a) => {
      assigneeMap.set(a.user.id, a.user.name);
    });
  });
  return {
    assignees: Array.from(assigneeMap, ([value, label]) => ({ value, label })),
    dueDate: [
      { value: 'routine', label: 'שוטף' },
      { value: 'immediate', label: 'מיידי' },
      { value: 'date', label: 'תאריך' },
    ],
    status: [
      { value: 'open', label: STATUS_LABELS.open },
      { value: 'inProgress', label: STATUS_LABELS.inProgress },
      { value: 'completed', label: STATUS_LABELS.completed },
    ],
  };
}
