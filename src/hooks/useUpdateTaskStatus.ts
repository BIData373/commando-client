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

export function useUpdateTaskStatus() {
	const queryClient = useQueryClient()

	function getAffectedQueryKeys(taskId: number, status: WorkspaceStatusDto) {
		const task: QueryKey = getGetTaskQueryKey({ id: taskId })
		const rows: QueryKey[] = [
			getListPersonalTaskRowsQueryKey(),
			getListTaskRowsQueryKey({ workspaceId: status.workspaceId }),
		]

		return { task, rows, all: [task, ...rows] }
	}

	const { mutate } = useMutation({
		networkMode: "always",
		mutationFn: ({ taskId, assigneeId, status }: UpdateStatusVariables) =>
			assigneeId !== undefined
				? upsertAssigneeTaskStatus({ taskId, assigneeId, statusId: status.id })
				: updateTask({ id: taskId }, { statusId: status.id }),
		onMutate: ({ assigneeId, status, taskId }) => {
			const { task, rows, all } = getAffectedQueryKeys(taskId, status)

			const previousQueriesData: PreviousQueriesData = all.flatMap((queryKey) =>
				queryClient.getQueriesData({ queryKey }),
			)

			queryClient.setQueriesData(
				{ queryKey: task },
				(data?: TaskWithWorkspaceDto) =>
					updateTaskDetailStatus(data, taskId, assigneeId, status),
			)

			rows.forEach((queryKey) => {
				queryClient.setQueriesData({ queryKey }, (data?: TaskRowDto[]) =>
					updateTaskRowsStatus(data, taskId, assigneeId, status),
				)
			})

			return { previousQueriesData }
		},
		onError: (
			_error: Error,
			_variables: UpdateStatusVariables,
			context?: { previousQueriesData: PreviousQueriesData },
		) => {
			context?.previousQueriesData.forEach(([queryKey, data]) => {
				queryClient.setQueryData(queryKey, data)
			})
		},
		onSettled: (
			_data: unknown,
			_error: Error | null,
			{ taskId, status }: UpdateStatusVariables,
		) => {
			invalidateQueries(getAffectedQueryKeys(taskId, status).all)
		},
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
