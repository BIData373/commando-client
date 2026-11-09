import styled from "@emotion/styled"
import type { HeaderContext } from "@tanstack/react-table"
import type { TaskRowDto } from "src/api/model"
import type { AppTableFeatures } from "src/consts/table-features"
import { useTaskTable } from "src/providers/TaskTableProvider"
import type { FilterOptions } from "src/utils/filter-utils"
import { COLUMN_LABELS } from "src/utils/task-table-utils"
import { UnreadDot } from "../../shared/UnreadDot"
import { ColumnHeaderWithActions } from "../ColumnHeaderWithActions"

export function LastMessageColumnHeader<TTask extends TaskRowDto, TValue>({
	table,
	column,
}: HeaderContext<AppTableFeatures, TTask, TValue>) {
	const { showUnreadDot, filterOptionsMap } = useTaskTable()
	const hasUnreadMessages =
		showUnreadDot &&
		table
			.getCoreRowModel()
			.rows.some(
				({ original: { lastMessage, viewedMessages } }) =>
					lastMessage?.content && !viewedMessages,
			)

	return (
		<ColumnHeaderWithActions
			label={
				<>
					{hasUnreadMessages && <InlineDot />}
					{COLUMN_LABELS.lastMessage}
				</>
			}
			column={column}
			filterOptions={filterOptionsMap?.[column.id as FilterOptions]}
		/>
	)
}

const InlineDot = styled(UnreadDot)`
  position: static;
  display: inline-block;
  margin-inline-end: 4px;
  vertical-align: middle;
`
