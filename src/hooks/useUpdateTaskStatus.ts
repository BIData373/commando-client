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
import { MutationOperation } from "src/functions/toasts"
import { invalidateQueries } from "src/query-client"

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

interface UpdateTaskStatusOptions {
	/**
	 * Reports each update through a toast. Off by default so a caller updating
	 * several tasks at once reports one aggregated result rather than one toast
	 * per task; single-task callers opt in.
	 */
	notify?: boolean
}

export function useUpdateTaskStatus({
	notify = false,
}: UpdateTaskStatusOptions = {}) {
	const queryClient = useQueryClient()

	function getAffectedQueryKeys(taskId: number, status: WorkspaceStatusDto) {
		const task: QueryKey = getGetTaskQueryKey({ id: taskId })
		const rows: QueryKey[] = [
			getListPersonalTaskRowsQueryKey(),
			getListTaskRowsQueryKey({ workspaceId: status.workspaceId }),
		]

		return { task, rows, all: [task, ...rows] }
	}

	const { mutateAsync } = useMutation({
		mutationKey: [MutationOperation.UpdateTaskStatus],
		meta: { toast: { success: notify, error: notify } },
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

	/**
	 * Resolves to whether the update succeeded rather than rejecting, so
	 * fire-and-forget callers cannot produce an unhandled rejection while bulk
	 * callers can still count the failures.
	 */
	async function updateTaskStatus(
		taskId: number,
		assigneeId: number | undefined,
		status: WorkspaceStatusDto,
	) {
		try {
			await mutateAsync({ taskId, assigneeId, status })
			return true
		} catch {
			return false
		}
	}

	return updateTaskStatus
}
