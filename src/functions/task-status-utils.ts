import type { TaskDto, TaskRowDto, WorkspaceStatusDto } from "src/api/model"

export function updateTaskRowsStatus<TRow extends TaskRowDto>(
	rows: TRow[] | undefined,
	taskId: number,
	assigneeId: number | undefined,
	status: WorkspaceStatusDto,
): TRow[] | undefined {
	return rows?.map((row) =>
		row.id === taskId && row.assignee?.id === assigneeId
			? { ...row, status }
			: row,
	)
}

export function updateTaskDetailStatus<TTask extends TaskDto>(
	task: TTask | undefined,
	taskId: number,
	assigneeId: number | undefined,
	status: WorkspaceStatusDto,
): TTask | undefined {
	if (!task || task.id !== taskId) {
		return task
	}

	if (assigneeId === undefined) {
		return { ...task, status }
	}

	return {
		...task,
		assigneeStatuses: task.assigneeStatuses.map((assigneeStatus) =>
			assigneeStatus.assignee.id === assigneeId
				? { ...assigneeStatus, status }
				: assigneeStatus,
		),
	}
}
