import type { TaskRowDto } from "src/api/model"
import {
	getListPersonalTaskRowsQueryKey,
	getListTaskRowsQueryKey,
} from "src/api/task/task"
import { queryClient } from "src/queryClient"

export function setTaskViewed(taskId: number, workspaceId?: number) {
	const update = (rows: TaskRowDto[] | undefined) =>
		rows?.map((row) =>
			row.id === taskId
				? { ...row, viewedInTable: true, viewedMessages: true }
				: row,
		)
	const workspaceKey = getListTaskRowsQueryKey(
		...(workspaceId ? [{ workspaceId }] : []),
	)
	queryClient.setQueriesData({ queryKey: workspaceKey }, update)

	queryClient.setQueriesData(
		{ queryKey: getListPersonalTaskRowsQueryKey() },
		update,
	)
}
