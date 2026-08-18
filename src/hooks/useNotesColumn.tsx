import styled from "@emotion/styled"
import type { ColumnDef } from "@tanstack/react-table"
import type { TaskRowDto } from "src/api/model"
import { COLUMN_LABELS } from "src/utils/task-table-utils"

/**
 * Notes column definition for the task table.
 * Extracted to allow easy removal/restoration of notes feature.
 */
export function getNotesColumnDef<
	TTask extends TaskRowDto,
>(): ColumnDef<TTask> {
	return {
		id: "notes",
		accessorKey: "notes",
		header: COLUMN_LABELS.notes,
		size: 100,
		enableSorting: false,
		enableColumnFilter: false,
		meta: { grow: true },
		cell: ({ getValue }) => {
			const notes = getValue<string>()
			return notes ? (
				<NotesText dangerouslySetInnerHTML={{ __html: notes }} />
			) : null
		},
	} as ColumnDef<TTask>
}

const NotesText = styled.div`
  overflow: hidden;
  max-height: 40px;

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
