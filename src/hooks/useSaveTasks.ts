import { type CreateTaskDto, DeadlineType } from "src/api/model"
import { invalidateQueries } from "src/queryClient"
import { getListTagsQueryKey } from "../api/tag/tag"
import {
	getListPersonalTaskRowsQueryKey,
	getListTaskRowsQueryKey,
	useCreateTask,
	useUpdateTask,
} from "../api/task/task"

interface TaskInput extends CreateTaskDto {
	groupKey?: string
	taskId?: number
}

export function useSaveTasks(workspaceId: number, onDone?: () => void) {
	const mutationCallbacks = {
		onSuccess: () => {
			invalidateQueries([
				getListTaskRowsQueryKey({ workspaceId }),
				getListPersonalTaskRowsQueryKey(),
				getListTagsQueryKey(),
			])

			onDone?.()
		},
	}

	const { mutateAsync: createTask, isPending: isCreating } = useCreateTask({
		mutation: mutationCallbacks,
	})

	const { mutateAsync: updateTask, isPending: isUpdating } = useUpdateTask({
		mutation: mutationCallbacks,
	})

	function saveTasks(inputs: TaskInput[]) {
		for (const { deadlineType, title, taskId, ...input } of inputs) {
			const data = {
				title: title.trim(),
				deadlineType: deadlineType ?? DeadlineType.ROLLING,
				dueDate: input.dueDate ?? null,
				...input,
			}

			if (taskId !== undefined) {
				updateTask({ pathParams: { id: taskId }, data })
			} else {
				createTask({ data })
			}
		}
	}

	return { saveTasks, isPending: isCreating || isUpdating }
}
