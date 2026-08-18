import type { TaskColumnMeta } from "./task-table-utils"

/**
 * Notes column metadata for task tables.
 * Extracted to allow easy removal/restoration of notes feature.
 */
export const NOTES_COLUMN_META: TaskColumnMeta = {
	id: "notes",
	label: "הערות",
}
