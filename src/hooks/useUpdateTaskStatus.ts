import { useUpsertAssigneeTaskStatus } from "src/api/assignee-task-status/assignee-task-status"
import { getGetTaskQueryKey, useUpdateTask } from "src/api/task/task"
import { invalidateQueries } from "src/queryClient"

interface UseUpdateTaskStatusOptions {
	onSuccess?(): void
}

export function useUpdateTaskStatus({
	onSuccess,
}: UseUpdateTaskStatusOptions = {}) {
	const { mutate: upsertAssigneeTaskStatus } = useUpsertAssigneeTaskStatus({
		mutation: {
			onSuccess: ({ task: { id } }) => {
				invalidateQueries([getGetTaskQueryKey({ id })])
				onSuccess?.()
			},
		},
	})

	const { mutate: updateTask } = useUpdateTask({
		mutation: {
			onSuccess: ({ id }) => {
				invalidateQueries([getGetTaskQueryKey({ id })])
				onSuccess?.()
			},
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
