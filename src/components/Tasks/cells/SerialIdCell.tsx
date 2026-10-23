import styled from "@emotion/styled"
import type { CellContext } from "@tanstack/react-table"
import type { TaskRowDto } from "src/api/model"
import { useTaskTable } from "src/providers/TaskTableProvider"
import type { AppTableFeatures } from "src/utils/table-features"
import HighlightMatch from "../../shared/HighlightMatch"

export function SerialIdCell<TTask extends TaskRowDto, TValue>({
	row: {
		original: { serialId },
	},
}: CellContext<AppTableFeatures, TTask, TValue>) {
	const { searchQuery } = useTaskTable()

	return (
		<IdCell>
			<HighlightMatch
				text={String(serialId)}
				query={searchQuery}
				variant="mark"
			/>
		</IdCell>
	)
}

const IdCell = styled.span`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: var(--fs-btn);
  font-weight: 400;
  line-height: 24px;
  color: var(--text-color);
  width: 100%;
  height: var(--table-row-height, 100%);
  cursor: pointer;
  /* Stays visible below the header while its spanned cell scrolls */
  position: sticky;
  top: var(--table-header-height, 0px);
`
