import { type CreateTaskDto, DeadlineType } from "src/api/model"
import { invalidateQueries } from "src/queryClient"
import { getListTagsQueryKey } from "../api/tag/tag"
import {
	getListPersonalTaskRowsQueryKey,
	getListTaskRowsQueryKey,
	useCreateTask,
} from "../api/task/task"

interface TaskInput extends CreateTaskDto {
	groupKey?: string
}

export function useSaveTasks(workspaceId: number, onDone?: () => void) {
	const { mutateAsync: createTask, isPending } = useCreateTask({
		mutation: {
			onSuccess: () => {
				invalidateQueries([
					getListTaskRowsQueryKey({ workspaceId }),
					getListPersonalTaskRowsQueryKey(),
					getListTagsQueryKey(),
				])
				onDone?.()
			},
		},
	})

	function saveTasks(inputs: TaskInput[]) {
		for (const { deadlineType, notes, title, ...input } of inputs) {
			createTask({
				data: {
					title: title.trim(),
					deadlineType: deadlineType ?? DeadlineType.ROLLING,
					dueDate: input.dueDate ?? null,
					notes: notes || undefined,
					...input,
				},
			})
		}
	}

	return { saveTasks, isPending }
}
