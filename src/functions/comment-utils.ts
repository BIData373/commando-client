import { getListMessagesQueryKey } from "src/api/message/message"
import {
	getGetTaskQueryKey,
	getListPersonalTaskRowsQueryKey,
	getListTaskRowsQueryKey,
} from "src/api/task/task"
import { invalidateQueries } from "src/query-client"

export function handleSettled(taskId: number) {
	return () =>
		invalidateQueries([
			getListMessagesQueryKey({ taskIds: [taskId] }),
			getGetTaskQueryKey({ id: taskId }),
			getListTaskRowsQueryKey(),
			getListPersonalTaskRowsQueryKey(),
		])
}
