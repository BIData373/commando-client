import type { QueryKey } from "@tanstack/react-query"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import {
	upsertAssigneeTaskStatus,
	useUpsertAssigneeTaskStatus,
} from "src/api/assignee-task-status/assignee-task-status"
import type { TaskRowDto, WorkspaceStatusDto } from "src/api/model"
import { getGetTaskQueryKey, useListTasks } from "src/api/task/task"
import { withUpdatedTaskStatus } from "src/functions/task-cache-utils"

interface UpdateStatusVariables {
	taskId: number
	assigneeId: number
	status: WorkspaceStatusDto
}

export function useUpdateTaskStatus<TTask extends TaskRowDto>(
	tasksQueryKey: QueryKey,
	onSettled?: () => void,
) {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({ taskId, assigneeId, status }: UpdateStatusVariables) =>
			upsertAssigneeTaskStatus({ taskId, assigneeId, statusId: status.id }),
		onMutate: async ({ taskId, assigneeId, status }: UpdateStatusVariables) => {
			// Is this really required?
			// await queryClient.cancelQueries({ queryKey })

			const originalTasks = queryClient.getQueryData<TTask[]>(tasksQueryKey)

			queryClient.setQueryData<TTask[]>(
				tasksQueryKey,
				withUpdatedTaskStatus<TTask>(taskId, assigneeId, status),
			)
			return { originalTasks }
		},

		onError: (_, __, context) => {
			if (context?.originalTasks) {
				queryClient.setQueryData(tasksQueryKey, context.originalTasks)
			}
		},
		onSettled,
	})
}
