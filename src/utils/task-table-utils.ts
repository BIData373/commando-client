import type { AccessorFnColumnDef, Row } from "@tanstack/react-table"
import { type SortingState, sortingFns } from "@tanstack/react-table"
import { concat, map, uniq } from "lodash"
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
	{ id: "source", label: "מקור" },
	{ id: "tags", label: "נושא" },
	{ id: "notes", label: "הערות" },
	{ id: "createdAt", label: "תאריך יצירה" },
	{ id: "updatedAt", label: "עודכן ב" },
]

export const TASK_COLUMN_DEFINITIONS: Partial<
	Record<
		keyof Partial<TaskRowWithWorkspaceDto>,
		Partial<AccessorFnColumnDef<Partial<TaskRowWithWorkspaceDto>>>
	>
> = {
	status: {
		accessorFn: (row) => row.status?.type,
		sortingFn: (rowA, rowB) =>
			(rowA.original.status?.id ?? 0) - (rowB.original.status?.id ?? 0),
	},
	assignee: {
		sortingFn: "text",
		accessorFn: (row) => row.assignee?.name,
	},
	tags: {
		accessorFn: (row) =>
			uniq(map(concat(row.tags, row.source?.tags ?? []), "name")),
	},
	deadlineType: {
		sortingFn: (
			{ original: { dueDate: dueDateA } },
			{ original: { dueDate: dueDateB } },
		) => {
			const a = dueDateA ? new Date(dueDateA).getTime() : Infinity
			const b = dueDateB ? new Date(dueDateB).getTime() : Infinity
			return a > b ? 1 : a < b ? -1 : 0
		},
	},
	source: {
		sortingFn: "text",
		accessorFn: (row) => row.source?.name,
	},
	workspace: {
		sortingFn: (rowA, rowB) => {
			const a = rowA.original.workspace?.title ?? ""
			const b = rowB.original.workspace?.title ?? ""
			return a.localeCompare(b, "he")
		},
		accessorFn: (row) => row.workspace?.title,
	},
	createdAt: { sortingFn: "datetime" },
	updatedAt: { sortingFn: "datetime" },
}

export const CONFIGURABLE_COLUMNS = TASK_COLUMNS_META.filter(
	(c) => c.id !== "id",
)

export const DEFAULT_COLUMN_ORDER = CONFIGURABLE_COLUMNS.map((c) => c.id)

// FIX Remove?
export const TASK_ROW_ID_SEPARATOR = "_"

export const multiSelectFilter = <T>(value: T, filterValue: T[]) => {
	return filterValue && filterValue?.length > 0
		? Array.isArray(value)
			? value.some((current) => filterValue.includes(current))
			: filterValue.includes(value)
		: true
}

function formatSortFnRow<T>(row: T) {
	return {
		getValue: (id: string) => row[id as keyof T],
		original: row,
	} as Row<T>
}

export function sortByTaskColumns<TTask extends TaskRowDto>(
	taskRows: TTask[],
	sorting: SortingState,
) {
	return [...taskRows].sort((a, b) => {
		const sorted = sorting
			.map(({ id, desc }) => {
				const defId = id as keyof TaskRowWithWorkspaceDto

				const configuredSort =
					TASK_COLUMN_DEFINITIONS[defId]?.sortingFn || "alphanumeric"

				const sortFn =
					typeof configuredSort === "string"
						? sortingFns[configuredSort as keyof typeof sortingFns] ||
							sortingFns.alphanumeric
						: configuredSort

				return {
					result: sortFn(formatSortFnRow(a), formatSortFnRow(b), id),
					desc,
				}
			})
			.find(({ result }) => result !== 0)

		return sorted ? (sorted.desc ? -sorted.result : sorted.result) : 0
	})
}
