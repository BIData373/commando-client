import { type CreateTaskDto, DeadlineType, type TaskDto } from "src/api/model"
import { invalidateQueries, queryClient } from "src/queryClient"
import { getListTagsQueryKey } from "../api/tag/tag"
import { getListTasksQueryKey, useCreateTask } from "../api/task/task"

interface TaskInput extends CreateTaskDto {
	groupKey?: string
}

export function useSaveTasks(workspaceId: number, onDone?: () => void) {
	const { mutateAsync: createTask, isPending } = useCreateTask({
		mutation: {
			onSuccess: ({ workspace: _, ...task }) => {
				queryClient.setQueryData<TaskDto[]>(
					getListTasksQueryKey({ workspaceId }),
					(prev) => (prev ? [...prev, task] : [task]),
				)
				invalidateQueries([getListTagsQueryKey()])
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
