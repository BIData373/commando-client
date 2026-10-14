import { countBy, map } from "lodash"
import type { TaskRowDto, WorkspaceStatusDto } from "src/api/model"

export interface StatusTaskCount
	extends Pick<WorkspaceStatusDto, "id" | "name" | "color"> {
	count: number
}

export function countTasksByStatus(
	tasks: TaskRowDto[],
	statuses: Record<number, WorkspaceStatusDto>,
): StatusTaskCount[] {
	const counts = countBy(tasks, "status.id")

	return map(statuses, (status) => ({
		...status,
		count: counts[status.id] ?? 0,
	}))
}
