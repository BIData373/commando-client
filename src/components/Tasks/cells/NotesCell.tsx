import styled from "@emotion/styled"
import type { CellContext } from "@tanstack/react-table"
import type { TaskRowDto } from "src/api/model"
import type { AppTableFeatures } from "src/utils/table-features"
import EllipsisTooltip from "../../shared/EllipsisTooltip"

export function NotesCell<TTask extends TaskRowDto, TValue>({
	row: {
		original: { notes },
	},
}: CellContext<AppTableFeatures, TTask, TValue>) {
	return notes && <NotesText tooltip={notes}>{notes}</NotesText>
}

const NotesText = styled(EllipsisTooltip)`
  font-size: var(--fs-btn);
  line-height: 20px;
  color: var(--sea-ink-soft);
  text-align: right;
`
