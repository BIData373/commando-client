import NotesField from "./NotesField"

/**
 * Notes section for the create/edit task modal.
 * Extracted to allow easy removal/restoration of notes feature.
 */

interface CreateTaskNotesSectionProps {
	notes: string
	onNotesChange: (value: string) => void
}

function CreateTaskNotesSection({
	notes,
	onNotesChange,
}: CreateTaskNotesSectionProps) {
	return <NotesField notes={notes} onNotesChange={onNotesChange} />
}

export default CreateTaskNotesSection
