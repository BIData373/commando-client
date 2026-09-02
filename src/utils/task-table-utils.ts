import type {
	AccessorColumnDef,
	ColumnDef,
	FilterFn,
} from "@tanstack/react-table"
import { concat, intersection, map, uniq, zipObject } from "lodash"
import type { TaskRowDto, TaskRowWithWorkspaceDto } from "src/api/model"

export interface TaskColumnMeta {
	id: keyof TaskRowWithWorkspaceDto
	label: string
}

function toColumnsMeta<
	T extends Partial<Record<keyof TaskRowWithWorkspaceDto, string>>,
>(labels: T): { id: keyof T; label: string }[] {
	return map(labels, (label, id) => ({ id, label })) as {
		id: keyof T
		label: string
	}[]
}

const CONFIGURABLE_COLUMNS_META = toColumnsMeta({
	id: 'מס"ד',
	title: "ההנחיה",
	status: "סטטוס",
	assignee: "אחראי",
	deadlineType: 'תג"ב',
	source: "מקור הנחיה",
	lastMessage: "תגובות",
	tags: "תגיות",
	notes: "הערות",
	createdAt: "תאריך יצירה",
	updatedAt: "עודכן ב",
})

export const EXTRA_COLUMNS_META = toColumnsMeta({
	workspace: "מפקד מנחה",
	archivedAt: "הועבר לארכיון",
})

export const [WORKSPACE_COLUMN_META, ARCHIVED_AT_COLUMN_META] =
	EXTRA_COLUMNS_META

const TASK_COLUMN_IDS = [
	...CONFIGURABLE_COLUMNS_META.map((c) => c.id),
	...EXTRA_COLUMNS_META.map((c) => c.id),
	"select",
	"actions",
] as const

export const TASK_COLUMN_ID = zipObject(TASK_COLUMN_IDS, TASK_COLUMN_IDS) as {
	[K in (typeof TASK_COLUMN_IDS)[number]]: K
}

export const TASK_COLUMNS_META: TaskColumnMeta[] = [
	...CONFIGURABLE_COLUMNS_META,
	...EXTRA_COLUMNS_META,
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
	[TASK_COLUMN_ID.status]: {
		accessorFn: (row) => row.status?.type,
		sortingFn: (rowA, rowB) =>
			(rowA.original.status?.id ?? 0) - (rowB.original.status?.id ?? 0),
		filterFn: multiSelectColumnFilter,
	},
	[TASK_COLUMN_ID.assignee]: {
		sortingFn: "text",
		accessorFn: (row) => row.assignee?.name,
		filterFn: multiSelectColumnFilter,
	},
	[TASK_COLUMN_ID.tags]: {
		accessorFn: (row) =>
			uniq(map(concat(row.tags, row.source?.tags ?? []), "name")),
		filterFn: "arrIncludesSome",
	},
	[TASK_COLUMN_ID.deadlineType]: {
		accessorKey: TASK_COLUMN_ID.deadlineType,
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
	[TASK_COLUMN_ID.source]: {
		sortingFn: "text",
		accessorFn: (row) => row.source?.name,
		filterFn: multiSelectColumnFilter,
	},
	[TASK_COLUMN_ID.createdAt]: { sortingFn: "datetime" },
	[TASK_COLUMN_ID.updatedAt]: { sortingFn: "datetime" },
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

export const CONFIGURABLE_COLUMNS = CONFIGURABLE_COLUMNS_META.filter(
	(c) => c.id !== TASK_COLUMN_ID.id,
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

export const DISABLED_CLICK_COLUMNS = new Set<string>([
	TASK_COLUMN_ID.assignee,
	TASK_COLUMN_ID.status,
	TASK_COLUMN_ID.actions,
	TASK_COLUMN_ID.select,
])

// FIX Remove?
export const TASK_ROW_ID_SEPARATOR = "_"

export const HAS_ASSIGNEE_DATA_ATTR = "data-has-assignee"

export const WORKSPACE_DEFAULT_HIDDEN = new Set<keyof TaskRowWithWorkspaceDto>([
	TASK_COLUMN_ID.notes,
	TASK_COLUMN_ID.updatedAt,
])

// ─── Archive ────────────────────────────────────────────────────────────────

export const ARCHIVE_DEFAULT_COLUMN_ORDER: (keyof TaskRowWithWorkspaceDto)[] = [
	TASK_COLUMN_ID.title,
	TASK_COLUMN_ID.status,
	TASK_COLUMN_ID.assignee,
	TASK_COLUMN_ID.deadlineType,
	TASK_COLUMN_ID.source,
	TASK_COLUMN_ID.workspace,
	TASK_COLUMN_ID.archivedAt,
	TASK_COLUMN_ID.lastMessage,
	TASK_COLUMN_ID.createdAt,
	TASK_COLUMN_ID.tags,
	TASK_COLUMN_ID.notes,
	TASK_COLUMN_ID.updatedAt,
]

export const ARCHIVE_DEFAULT_HIDDEN = new Set<keyof TaskRowWithWorkspaceDto>([
	TASK_COLUMN_ID.tags,
	...WORKSPACE_DEFAULT_HIDDEN,
])
