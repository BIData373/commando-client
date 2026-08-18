import type { TaskRowDto } from "src/api/model"

/**
 * Returns notes-related search values for a task.
 * Extracted to allow easy removal/restoration of notes in search.
 */
export function getNotesSearchValues(task: TaskRowDto): string[] {
	return task.notes ? [task.notes] : []
}
