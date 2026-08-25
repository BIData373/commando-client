import { useUpsertAssigneeTaskStatus } from "src/api/assignee-task-status/assignee-task-status"
import {
	getGetTaskQueryKey,
	getListPersonalTaskRowsQueryKey,
	getListTaskRowsQueryKey,
	useUpdateTask,
} from "src/api/task/task"
import { invalidateQueries } from "src/queryClient"

interface UseUpdateTaskStatusOptions {
	workspaceId?: number
	onSuccess?(): void
}

export function useUpdateTaskStatus({
	workspaceId,
	onSuccess,
}: UseUpdateTaskStatusOptions = {}) {
	function handleSettled(taskId: number) {
		const keys = [
			getGetTaskQueryKey({ id: taskId }),
			getListPersonalTaskRowsQueryKey(),
			...(workspaceId ? [getListTaskRowsQueryKey({ workspaceId })] : []),
		]
		invalidateQueries(keys)
	}

	function handleSuccess() {
		onSuccess?.()
	}

	const { mutate: upsertAssigneeTaskStatus } = useUpsertAssigneeTaskStatus({
		mutation: {
			onSuccess: handleSuccess,
			onSettled: (data) => data && handleSettled(data.task.id),
		},
	})

	const { mutate: updateTask } = useUpdateTask({
		mutation: {
			onSuccess: handleSuccess,
			onSettled: (data) => data && handleSettled(data.id),
		},
	})

	function updateTaskStatus(
		taskId: number,
		assigneeId: number | undefined,
		statusId: number,
	) {
		if (assigneeId) {
			upsertAssigneeTaskStatus({ data: { taskId, assigneeId, statusId } })
		} else {
			updateTask({ pathParams: { id: taskId }, data: { statusId } })
		}
	}

	return updateTaskStatus
}
