import type { CellContext } from "@tanstack/react-table"
import type { TaskRowDto } from "src/api/model"
import { useTaskTable } from "src/providers/TaskTableProvider"
import type { AppTableFeatures } from "src/utils/table-features"
import { TopicCell } from "../TopicCell"

export function TagsCell<TTask extends TaskRowDto>({
	getValue,
}: CellContext<AppTableFeatures, TTask, string[]>) {
	const { searchQuery } = useTaskTable()

	return <TopicCell tags={getValue()} searchQuery={searchQuery} />
}
