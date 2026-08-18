/**
 * Extracts notes-related fields for task save payload.
 * Extracted to allow easy removal/restoration of notes in save.
 */
export function getNotesSaveFields(notes?: string | null): {
	notes?: string
} {
	return notes ? { notes } : {}
}
