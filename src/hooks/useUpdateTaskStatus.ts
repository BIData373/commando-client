import type { QueryKey } from "@tanstack/react-query"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { upsertAssigneeTaskStatus } from "src/api/assignee-task-status/assignee-task-status"
import type {
	TaskDto,
	TaskRowDto,
	TaskWithWorkspaceDto,
	WorkspaceStatusDto,
} from "src/api/model"
import {
	getGetTaskQueryKey,
	getListPersonalTaskRowsQueryKey,
	getListTaskRowsQueryKey,
	updateTask,
} from "src/api/task/task"

import { invalidateQueries } from "src/queryClient"

interface UseUpdateTaskStatusOptions {
	onSuccess?(): void
}

interface UpdateStatusVariables {
	taskId: number
	assigneeId: number | undefined
	status: WorkspaceStatusDto
}

type PreviousQueriesData = [QueryKey, unknown][]

function updateTaskRowsStatus<TRow extends TaskRowDto>(
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

function updateTaskDetailStatus<TTask extends TaskDto>(
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

export function useUpdateTaskStatus({
	onSuccess,
}: UseUpdateTaskStatusOptions = {}) {
	const queryClient = useQueryClient()

	function getAffectedQueryKeys(taskId: number, status: WorkspaceStatusDto) {
		return {
			task: [getGetTaskQueryKey({ id: taskId })],
			rows: [
				getListPersonalTaskRowsQueryKey(),
				getListTaskRowsQueryKey({ workspaceId: status.workspaceId }),
			],
		}
	}

	function handleMutate({ taskId, assigneeId, status }: UpdateStatusVariables) {
		const { task, rows } = getAffectedQueryKeys(taskId, status)

		const previousQueriesData: PreviousQueriesData = [...task, ...rows].map(
			(queryKey) => [queryKey, queryClient.getQueryData(queryKey)],
		)

		queryClient.setQueryData(task, (data?: TaskWithWorkspaceDto) =>
			updateTaskDetailStatus(data, taskId, assigneeId, status),
		)

		rows.forEach((queryKey) => {
			queryClient.setQueryData(queryKey, (data: TaskRowDto[]) =>
				updateTaskRowsStatus(data, taskId, assigneeId, status),
			)
		})

		return { previousQueriesData }
	}

	function handleError(
		_error: Error,
		_variables: UpdateStatusVariables,
		context?: { previousQueriesData: PreviousQueriesData },
	) {
		context?.previousQueriesData.forEach(([queryKey, data]) => {
			queryClient.setQueryData(queryKey, data)
		})
	}

	function handleSettled(
		_data: unknown,
		_error: Error | null,
		{ taskId, status }: UpdateStatusVariables,
	) {
		invalidateQueries(
			Object.values(getAffectedQueryKeys(taskId, status)).flat(),
		)
	}

	const { mutate } = useMutation({
		mutationFn: ({ taskId, assigneeId, status }: UpdateStatusVariables) =>
			assigneeId !== undefined
				? upsertAssigneeTaskStatus({ taskId, assigneeId, statusId: status.id })
				: updateTask({ id: taskId }, { statusId: status.id }),
		onMutate: handleMutate,
		onError: handleError,
		onSuccess,
		onSettled: handleSettled,
	})

	function updateTaskStatus(
		taskId: number,
		assigneeId: number | undefined,
		status: WorkspaceStatusDto,
	) {
		mutate({ taskId, assigneeId, status })
	}

	return updateTaskStatus
}
