import type { TaskRowDto } from "src/api/model"

/**
 * Notes column definition for Excel export.
 * Extracted to allow easy removal/restoration of notes in exports.
 */
export const NOTES_EXPORT_COLUMN = {
	header: "הערות",
	maxWidth: 50,
	accessor: (t: TaskRowDto) => t.notes ?? "",
}
