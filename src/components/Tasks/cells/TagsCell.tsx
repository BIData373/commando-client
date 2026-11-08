import styled from "@emotion/styled"
import type { CellContext } from "@tanstack/react-table"
import type { TaskRowDto } from "src/api/model"
import type { AppTableFeatures } from "src/consts/table-features"
import { useTaskTable } from "src/providers/TaskTableProvider"
import { TopicCell } from "../TopicCell"

export function TagsCell<TTask extends TaskRowDto>({
	getValue,
}: CellContext<AppTableFeatures, TTask, string[]>) {
	const { searchQuery } = useTaskTable()

	return <StickyTopicCell tags={getValue()} searchQuery={searchQuery} />
}

const StickyTopicCell = styled(TopicCell)`
  position: sticky;
  top: var(--table-header-height, 0px);
  height: var(--table-row-height, 100%);
`
