import type { CellContext } from "@tanstack/react-table"
import type { TaskRowDto, WorkspaceStatusDto } from "src/api/model"
import { useTaskTable } from "src/providers/TaskTableProvider"
import type { AppTableFeatures } from "src/utils/table-features"
import { StatusDropdown } from "../StatusDropdown"

export function StatusCell<TTask extends TaskRowDto, TValue>({
	row: {
		original: {
			id,
			status,
			assignee,
			editable,
			personalArchivedAt,
			workspaceArchivedAt,
		},
	},
}: CellContext<AppTableFeatures, TTask, TValue>) {
	const { statuses, getHandlers } = useTaskTable()

	function handleUpdate(
		taskId: number,
		assigneeId: number | undefined,
		nextStatus: WorkspaceStatusDto,
	) {
		getHandlers().onUpdateStatus(taskId, assigneeId, nextStatus)
	}

	return (
		status && (
			<StatusDropdown
				status={status}
				statuses={statuses}
				assigneeId={assignee?.id}
				editable={editable}
				taskId={id}
				isArchived={!!personalArchivedAt || !!workspaceArchivedAt}
				onUpdate={handleUpdate}
			/>
		)
	)
}
