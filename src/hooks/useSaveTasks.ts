import { type CreateTaskDto, DeadlineType } from "src/api/model"
import { useWorkspace } from "src/providers/WorkspaceProvider"
import { queryClient } from "src/queryClient"
import { getListTasksQueryKey, useCreateTask } from "../api/task/task"

interface TaskInput extends CreateTaskDto {
	groupKey?: string
}

export function useSaveTasks() {
	const {
		workspace: { id: workspaceId },
	} = useWorkspace()
	const { mutateAsync: createTask } = useCreateTask()

	async function saveTasks(inputs: TaskInput[]) {
		await Promise.all(
			inputs.map(({ deadlineType, notes, title, ...input }) =>
				createTask({
					data: {
						title: title.trim(),
						deadlineType: deadlineType ?? DeadlineType.ROLLING,
						dueDate: input.dueDate ?? new Date(),
						notes: notes || undefined,
						...input,
					},
				}),
			),
		)
		await queryClient.invalidateQueries({
			queryKey: getListTasksQueryKey({ workspaceId }),
		})
	}

	return saveTasks
}
