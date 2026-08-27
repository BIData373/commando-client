import type { TaskRowDto, WorkspaceStatusDto } from "src/api/model"

export function withUpdatedTaskStatus<TTask extends TaskRowDto>(
	taskId: number,
	assigneeId: number,
	status: WorkspaceStatusDto,
) {
	return (taskRows: TTask[] | undefined) =>
		taskRows?.map((task) =>
			task.id === taskId && task.assignee?.id === assigneeId
				? { ...task, status }
				: task,
		)
}
