import type {
	AccessorColumnDef,
	ColumnDef,
	FilterFn,
} from "@tanstack/react-table"
import { concat, intersection, map, uniq } from "lodash"
import type { TaskRowDto, TaskRowWithWorkspaceDto } from "src/api/model"

export interface TaskColumnMeta {
	id: keyof TaskRowWithWorkspaceDto
	label: string
}

export const TASK_COLUMNS_META: TaskColumnMeta[] = [
	{ id: "id", label: 'מס"ד' },
	{ id: "title", label: "ההנחיה" },
	{ id: "status", label: "סטטוס" },
	{ id: "assignee", label: "אחראי" },
	{ id: "deadlineType", label: 'תג"ב' },
	{ id: "source", label: "מקור הנחיה" },
	{ id: "lastMessage", label: "תגובות" },
	{ id: "tags", label: "נושא" },
	{ id: "createdAt", label: "תאריך יצירה" },
	{ id: "updatedAt", label: "עודכן ב" },
]

export const COLUMN_LABELS = Object.fromEntries(
	TASK_COLUMNS_META.map(({ id, label }) => [id, label]),
) as Record<keyof TaskRowWithWorkspaceDto, string>

export const multiSelectColumnFilter: FilterFn<Partial<TaskRowDto>> = (
	row,
	columnId,
	filterValue: string[],
) => {
	return !filterValue?.length || filterValue.includes(row.getValue(columnId))
}

export const TASK_COLUMN_DEFINITIONS: Partial<
	Record<
		keyof Partial<TaskRowDto>,
		Partial<AccessorColumnDef<Partial<TaskRowDto>>>
	>
> = {
	status: {
		accessorFn: (row) => row.status?.type,
		sortingFn: (rowA, rowB) =>
			(rowA.original.status?.id ?? 0) - (rowB.original.status?.id ?? 0),
		filterFn: multiSelectColumnFilter,
	},
	assignee: {
		sortingFn: "text",
		accessorFn: (row) => row.assignee?.name,
		filterFn: multiSelectColumnFilter,
	},
	tags: {
		accessorFn: (row) =>
			uniq(map(concat(row.tags, row.source?.tags ?? []), "name")),
		filterFn: "arrIncludesSome",
	},
	deadlineType: {
		accessorKey: "deadlineType",
		sortingFn: (
			{ original: { dueDate: dueDateA } },
			{ original: { dueDate: dueDateB } },
		) => {
			const a = dueDateA ? new Date(dueDateA).getTime() : Infinity
			const b = dueDateB ? new Date(dueDateB).getTime() : Infinity
			return a > b ? 1 : a < b ? -1 : 0
		},
		filterFn: multiSelectColumnFilter,
	},
	source: {
		sortingFn: "text",
		accessorFn: (row) => row.source?.name,
		filterFn: multiSelectColumnFilter,
	},
	createdAt: { sortingFn: "datetime" },
	updatedAt: { sortingFn: "datetime" },
}

export function buildCountingColumns<TTask extends TaskRowDto>(
	extraColumns: ColumnDef<TTask>[] = [],
): ColumnDef<TTask>[] {
	return [
		...Object.entries(TASK_COLUMN_DEFINITIONS).map(([id, def]) => ({
			id,
			...def,
		})),
		...extraColumns,
	] as ColumnDef<TTask>[]
}

export const CONFIGURABLE_COLUMNS = TASK_COLUMNS_META.filter(
	(c) => c.id !== "id",
)

export const DEFAULT_COLUMN_ORDER = CONFIGURABLE_COLUMNS.map((c) => c.id)

export function reconcileColumnOrder(
	storedOrder: (keyof TaskRowWithWorkspaceDto)[],
	knownIds: (keyof TaskRowWithWorkspaceDto)[],
): (keyof TaskRowWithWorkspaceDto)[] {
	return knownIds.reduce(
		(result, id, index) => {
			if (!result.includes(id)) {
				const cursor = index === 0 ? 0 : result.indexOf(knownIds[index - 1]) + 1

				result.splice(cursor, 0, id)
			}

			return result
		},
		intersection(storedOrder, knownIds),
	)
}

export function toHiddenColumns<TId extends string>(
	visibleColumns: TId[],
): Set<TId> {
	const visible = new Set(visibleColumns)
	return new Set(
		DEFAULT_COLUMN_ORDER.filter((id) => !visible.has(id as TId)) as TId[],
	)
}

export const DISABLED_CLICK_COLUMNS = new Set([
	"assignee",
	"status",
	"actions",
	"select",
])

// FIX Remove?
export const TASK_ROW_ID_SEPARATOR = "_"

export const HAS_ASSIGNEE_DATA_ATTR = "data-has-assignee"
