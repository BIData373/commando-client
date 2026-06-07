import { type CreateTaskDto, DeadlineType } from "src/api/model"
import { useWorkspace } from "src/providers/WorkspaceProvider"
import { queryClient } from "src/queryClient"
import { getListTasksQueryKey, useCreateTask } from "../api/task/task"

interface TaskInput extends CreateTaskDto {
	groupKey?: string
}

export function useSaveTasks() {
	const { workspace: { id: workspaceId } } = useWorkspace()
	const { mutate: createTask } = useCreateTask()

	function saveTasks(inputs: TaskInput[]) {
		for (const { deadlineType, notes, title, ...input } of inputs) {
			createTask({
				data: {
					title: title.trim(),
					deadlineType: deadlineType ?? DeadlineType.ROLLING,
					dueDate: input.dueDate ?? new Date(),
					notes: notes || undefined,
					...input,
				},
			}, {
				onSuccess: () => {
					queryClient.invalidateQueries({ queryKey: getListTasksQueryKey({ workspaceId }) })
				}
			})
		}
	}

	return saveTasks
}
