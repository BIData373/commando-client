import type { CellContext } from "@tanstack/react-table"
import type { TaskRowDto } from "src/api/model"
import type { AppTableFeatures } from "src/utils/table-features"
import { EMPTY_LIST } from "src/utils/task-table-utils"
import { AssigneeCell } from "../AssigneeCell"

export function AssigneesCell<TTask extends TaskRowDto, TValue>({
	row: {
		original: { assignee, otherAssignees },
	},
}: CellContext<AppTableFeatures, TTask, TValue>) {
	return (
		assignee && (
			<AssigneeCell
				assignee={assignee}
				otherAssignees={otherAssignees ?? EMPTY_LIST}
			/>
		)
	)
}
