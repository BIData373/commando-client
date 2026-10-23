import {
	type ColumnDef,
	createColumnHelper,
	type IdentifiedColumnDef,
	type Row,
} from "@tanstack/react-table"
import { concat, intersection, map, uniq, zipObject } from "lodash"
import type { TaskRowDto, TaskRowWithWorkspaceDto } from "src/api/model"
import { formatSourceLabel } from "../functions/source-utils"
import type { AppTableFeatures } from "./table-features"

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
	serialId: 'מס"ד',
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

export const WORKSPACE_COLUMN_META = toColumnsMeta({
	workspace: "מפקד מנחה",
})

export const PERSONAL_ARCHIVED_COLUMN_META = toColumnsMeta({
	personalArchivedAt: "הועבר לארכיון",
})

export const WORKSPACE_ARCHIVED_COLUMN_META = toColumnsMeta({
	workspaceArchivedAt: "הועבר לארכיון",
})

export const EXTRA_COLUMNS_META = [
	...WORKSPACE_COLUMN_META,
	...PERSONAL_ARCHIVED_COLUMN_META,
	...WORKSPACE_ARCHIVED_COLUMN_META,
]

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

function multiSelectColumnFilter<TTask extends TaskRowDto>(
	row: Row<AppTableFeatures, TTask>,
	columnId: string,
	filterValue: string[],
): boolean {
	return !filterValue?.length || filterValue.includes(row.getValue(columnId))
}

function compareDueDates(dueDateA: Date | null, dueDateB: Date | null) {
	const a = dueDateA ? new Date(dueDateA).getTime() : Infinity
	const b = dueDateB ? new Date(dueDateB).getTime() : Infinity
	return a > b ? 1 : a < b ? -1 : 0
}

/**
 * Accessor, sorting and filtering shared by the visible table and the headless
 * counting/export tables. Each entry builds its column, merging in per-table options.
 */
export function createTaskColumnDefinitions<TTask extends TaskRowDto>() {
	const columnHelper = createColumnHelper<AppTableFeatures, TTask>()

	function defineColumn<TValue>(
		id: string,
		accessorFn: (row: TTask) => TValue,
		base: IdentifiedColumnDef<AppTableFeatures, TTask, TValue> = {},
	) {
		return (
			options: IdentifiedColumnDef<AppTableFeatures, TTask, TValue> = {},
		) => columnHelper.accessor(accessorFn, { ...base, ...options, id })
	}

	return {
		status: defineColumn(TASK_COLUMN_ID.status, (row) => row.status?.type, {
			sortFn: (rowA, rowB) =>
				(rowA.original.status?.id ?? 0) - (rowB.original.status?.id ?? 0),
			filterFn: multiSelectColumnFilter,
		}),
		assignee: defineColumn(
			TASK_COLUMN_ID.assignee,
			(row) => row.assignee?.name,
			{
				sortFn: "text",
				filterFn: multiSelectColumnFilter,
			},
		),
		tags: defineColumn(
			TASK_COLUMN_ID.tags,
			(row) => uniq(map(concat(row.tags, row.source?.tags ?? []), "name")),
			{ filterFn: "arrIncludesSome" },
		),
		deadlineType: defineColumn(
			TASK_COLUMN_ID.deadlineType,
			(row) => row.deadlineType,
			{
				sortFn: (rowA, rowB) =>
					compareDueDates(rowA.original.dueDate, rowB.original.dueDate),
				filterFn: multiSelectColumnFilter,
			},
		),
		source: defineColumn(
			TASK_COLUMN_ID.source,
			(row) => row.source && formatSourceLabel(row.source),
			{ sortFn: "text", filterFn: multiSelectColumnFilter },
		),
		createdAt: defineColumn(TASK_COLUMN_ID.createdAt, (row) => row.createdAt, {
			sortFn: "datetime",
		}),
		updatedAt: defineColumn(TASK_COLUMN_ID.updatedAt, (row) => row.updatedAt, {
			sortFn: "datetime",
		}),
	}
}

export function buildCountingColumns<TTask extends TaskRowDto>(
	extraColumns: ColumnDef<AppTableFeatures, TTask>[] = [],
): ColumnDef<AppTableFeatures, TTask>[] {
	return createColumnHelper<AppTableFeatures, TTask>().columns([
		...Object.values(createTaskColumnDefinitions<TTask>()).map((define) =>
			define(),
		),
		...extraColumns,
	])
}

/** Keeps the per-assignee rows of a task adjacent so their shared cells can span, preserving first-appearance order. */
export function groupRowsByTask<TTask extends TaskRowDto>(
	tasks: TTask[],
): TTask[] {
	const rowsByTaskId = new Map<number, TTask[]>()

	tasks.forEach((task) => {
		rowsByTaskId.set(task.id, [...(rowsByTaskId.get(task.id) ?? []), task])
	})

	return [...rowsByTaskId.values()].flat()
}

export const CONFIGURABLE_COLUMNS = CONFIGURABLE_COLUMNS_META.filter(
	(c) => c.id !== TASK_COLUMN_ID.serialId,
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

export const ARCHIVE_DEFAULT_HIDDEN = new Set<keyof TaskRowWithWorkspaceDto>([
	TASK_COLUMN_ID.tags,
	...WORKSPACE_DEFAULT_HIDDEN,
])
