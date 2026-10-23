import { countBy, map } from "lodash"
import type { TaskRowDto, WorkspaceStatusDto } from "src/api/model"
import { STATUS_DEFAULTS } from "./status-defaults"

export interface StatusTaskCount
	extends Pick<WorkspaceStatusDto, "name" | "color"> {
	id: string | number
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

// Personal tasks span workspaces with their own status ids, so they are grouped by type
export function countTasksByStatusType(tasks: TaskRowDto[]): StatusTaskCount[] {
	const counts = countBy(tasks, "status.type")

	return map(STATUS_DEFAULTS, (status, type) => ({
		...status,
		id: type,
		count: counts[type] ?? 0,
	}))
}
