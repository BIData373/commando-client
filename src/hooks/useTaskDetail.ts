import { useGetTask } from "src/api/task/task"
import { useErrorHandler } from "src/providers/ErrorModalProvider"

export function useTaskDetail(taskId: string) {
	const { data: task, isFetched, error } = useGetTask({ id: Number(taskId) })

	useErrorHandler(error?.status)

	return { task, isFetched }
}
