import styled from "@emotion/styled"
import type { ColumnDef } from "@tanstack/react-table"
import type { TaskRowDto } from "src/api/model"
import type { TaskColumnMeta } from "./task-table-utils"

interface NotesColumnMeta extends Omit<TaskColumnMeta, "id"> {
	id: string
}

/**
 * All notes-related consts, functions, and styled components in one place.
 * Extracted to allow easy removal/restoration of notes feature.
 */

interface TaskRowWithNotes extends TaskRowDto {
	notes?: string | null
}

// ─── Column Meta ───────────────────────────────────────────────────────────

export const NOTES_COLUMN_META: NotesColumnMeta = {
	id: "notes",
	label: "הערות",
}

// ─── Search ────────────────────────────────────────────────────────────────

export function getNotesSearchValues(task: TaskRowWithNotes): string[] {
	return task.notes ? [task.notes] : []
}

// ─── Save Payload ──────────────────────────────────────────────────────────

export function getNotesSaveFields(notes?: string | null): {
	notes?: string
} {
	return notes ? { notes } : {}
}

// ─── Excel Export ──────────────────────────────────────────────────────────

export const NOTES_EXPORT_COLUMN = {
	header: "הערות",
	maxWidth: 50,
	accessor: (t: TaskRowWithNotes) => t.notes ?? "",
}

// ─── Styled ────────────────────────────────────────────────────────────────

export const NotesText = styled.div`
  font-size: var(--fs-btn);
  line-height: 20px;
  color: var(--sea-ink-soft);

  p {
    margin: 0;
  }

  ol {
    margin: 0;
    padding-inline-start: 20px;
    list-style-type: decimal;
  }

  li {
    margin: 0;
  }

  li p {
    display: inline;
  }

  strong {
    font-weight: 600;
  }

  u {
    text-decoration: underline;
  }
`

// ─── Table Column ──────────────────────────────────────────────────────────

const TableNotesText = styled(NotesText)`
  overflow: hidden;
  max-height: 40px;
`

export function getNotesColumnDef<
	TTask extends TaskRowWithNotes,
>(): ColumnDef<TTask> {
	return {
		id: "notes",
		accessorKey: "notes",
		header: NOTES_COLUMN_META.label,
		size: 100,
		enableSorting: false,
		enableColumnFilter: false,
		meta: { grow: true },
		cell: ({ getValue }) => {
			const notes = getValue<string>()
			return notes ? (
				<TableNotesText dangerouslySetInnerHTML={{ __html: notes }} />
			) : null
		},
	} as ColumnDef<TTask>
}
