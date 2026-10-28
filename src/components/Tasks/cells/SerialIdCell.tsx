import styled from "@emotion/styled"
import type { CellContext } from "@tanstack/react-table"
import type { TaskRowDto } from "src/api/model"
import type { AppTableFeatures } from "src/consts/table-features"
import { useTaskTable } from "src/providers/TaskTableProvider"
import HighlightMatch from "../../shared/HighlightMatch"
import { UnreadDot } from "../../shared/UnreadDot"

export function SerialIdCell<TTask extends TaskRowDto, TValue>({
	row: {
		original: { serialId, viewedInTable },
	},
}: CellContext<AppTableFeatures, TTask, TValue>) {
	const { searchQuery, showUnreadDot } = useTaskTable()

	return (
		<IdCell>
			{showUnreadDot && !viewedInTable && (
				<UnreadDot $right={6.5} $top={18.5} />
			)}
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
