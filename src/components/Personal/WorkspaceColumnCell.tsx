import type { CellContext } from "@tanstack/react-table"
import type { TaskRowWithWorkspaceDto } from "src/api/model"
import { useTaskTable } from "src/providers/TaskTableProvider"
import type { AppTableFeatures } from "src/utils/table-features"
import WorkspaceCell from "../shared/WorkspaceCell"

export function WorkspaceColumnCell<TValue>({
	row: {
		original: { workspace, createdBy },
	},
}: CellContext<AppTableFeatures, TaskRowWithWorkspaceDto, TValue>) {
	const { searchQuery } = useTaskTable()

	return (
		<WorkspaceCell
			workspace={workspace}
			createdBy={createdBy}
			searchQuery={searchQuery}
		/>
	)
}
