import type {
	AssigneeDto,
	AssigneeStatusDto,
	TaskDto,
	WorkspaceStatusDto,
	WorkspaceWithPermissionDto,
} from "src/api/model"

export type TaskRow = TaskDto & {
	rowKey: string
	assignee?: AssigneeDto
	status?: WorkspaceStatusDto
	otherAssignees?: AssigneeStatusDto[]
	workspace?: WorkspaceWithPermissionDto
}

export interface TaskColumnMeta {
	id: keyof TaskRow
	label: string
}

export const TASK_COLUMNS_META: TaskColumnMeta[] = [
	{ id: "id", label: 'מס"ד' },
	{ id: "title", label: "ההנחיה" },
	{ id: "status", label: "סטטוס" },
	{ id: "assigneeStatuses", label: "אחראי" },
	{ id: "deadlineType", label: 'תג"ב' },
	{ id: "source", label: "מקור" },
	{ id: "tags", label: "נושא" },
	{ id: "notes", label: "הערות" },
	{ id: "createdAt", label: "תאריך יצירה" },
	{ id: "updatedAt", label: "עודכן ב" },
]

export const CONFIGURABLE_COLUMNS = TASK_COLUMNS_META.filter(
	(c) => c.id !== "id",
)

export const DEFAULT_COLUMN_ORDER = CONFIGURABLE_COLUMNS.map((c) => c.id)

export const TASK_ROW_ID_SEPARATOR = "_"

export function formatTaskRowId(taskId: number, assigneeId?: number) {
	return `${taskId}${TASK_ROW_ID_SEPARATOR}${assigneeId}`
}

function formatTaskRow(
	task: TaskDto,
	assigneeStatus?: AssigneeStatusDto,
): TaskRow {
	const { id, assigneeStatuses } = task
	return {
		...task,
		rowKey: formatTaskRowId(id, assigneeStatus?.assignee?.id),
		...assigneeStatus,
		...(assigneeStatus?.assignee && {
			otherAssignees: assigneeStatuses.filter(
				(as) => as.assignee.id !== assigneeStatus.assignee.id,
			),
		}),
	}
}

export function toTaskRows(tasks: TaskDto[]): TaskRow[] {
	return tasks.flatMap((task) =>
		task.assigneeStatuses.length > 0
			? task.assigneeStatuses.map((assigneeStatus) =>
					formatTaskRow(task, assigneeStatus),
				)
			: [formatTaskRow(task)],
	)
}
