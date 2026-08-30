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

	function getAffectedQueryKeys(
		taskId: number,
		status: WorkspaceStatusDto,
	): QueryKey[] {
		return [
			getGetTaskQueryKey({ id: taskId }),
			getListPersonalTaskRowsQueryKey(),
			getListTaskRowsQueryKey({ workspaceId: status.workspaceId }),
		]
	}

	// Row lists are cached per filter combination (e.g. isArchived), so an
	// exact key like getListTaskRowsQueryKey({ workspaceId }) won't match the
	// actual cache entry. Match by key prefix instead to update every variant.
	function updateRowQueries(
		baseQueryKey: QueryKey,
		taskId: number,
		assigneeId: number | undefined,
		status: WorkspaceStatusDto,
		previousQueriesData: PreviousQueriesData,
	) {
		queryClient
			.getQueriesData<TaskRowDto[]>({ queryKey: baseQueryKey, exact: false })
			.forEach(([queryKey, rows]) => {
				previousQueriesData.push([queryKey, rows])
				queryClient.setQueryData(
					queryKey,
					updateTaskRowsStatus(rows, taskId, assigneeId, status),
				)
			})
	}

	function handleMutate({ taskId, assigneeId, status }: UpdateStatusVariables) {
		const taskQueryKey = getGetTaskQueryKey({ id: taskId })
		const previousQueriesData: PreviousQueriesData = [
			[taskQueryKey, queryClient.getQueryData(taskQueryKey)],
		]

		queryClient.setQueryData(taskQueryKey, (task?: TaskWithWorkspaceDto) =>
			updateTaskDetailStatus(task, taskId, assigneeId, status),
		)

		;[
			getListPersonalTaskRowsQueryKey(),
			getListTaskRowsQueryKey({ workspaceId: status.workspaceId }),
		].forEach((queryKey) => {
			updateRowQueries(
				queryKey,
				taskId,
				assigneeId,
				status,
				previousQueriesData,
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
		invalidateQueries(getAffectedQueryKeys(taskId, status))
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
