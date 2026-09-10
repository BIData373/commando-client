import { type CreateTaskDto, DeadlineType } from "src/api/model"
import { toast } from "src/components/Toast/toast-api"
import { saveTaskMessage } from "src/functions/toast-messages"
import { invalidateQueries } from "src/query-client"
import { runBatch } from "src/utils/batch-utils"
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

interface TaskUpdate extends TaskInput {
	taskId: number
}

function isUpdate(input: TaskInput): input is TaskUpdate {
	return input.taskId !== undefined
}

function toTaskData({ deadlineType, title, taskId, ...input }: TaskInput) {
	return {
		title: title.trim(),
		deadlineType: deadlineType ?? DeadlineType.ROLLING,
		dueDate: input.dueDate ?? null,
		...input,
	}
}

export function useSaveTasks(workspaceId: number, onDone?: () => void) {
	const { mutateAsync: createTask, isPending: isCreating } = useCreateTask()

	const { mutateAsync: updateTask, isPending: isUpdating } = useUpdateTask()

	async function saveTasks(inputs: TaskInput[]) {
		const [created, updated] = await Promise.all([
			runBatch(
				inputs.filter((input) => !isUpdate(input)),
				(input) => createTask({ data: toTaskData(input) }),
			),
			runBatch(inputs.filter(isUpdate), (input) =>
				updateTask({
					pathParams: { id: input.taskId },
					data: toTaskData(input),
				}),
			),
		])

		const saved = {
			succeeded: created.succeeded + updated.succeeded,
			failed: created.failed + updated.failed,
		}

		if (saved.succeeded > 0) {
			invalidateQueries([
				getListTaskRowsQueryKey({ workspaceId }),
				getListPersonalTaskRowsQueryKey(),
				getListTagsQueryKey(),
			])

			onDone?.()
		}

		toast.batch(saved, { message: saveTaskMessage })
	}

	return { saveTasks, isPending: isCreating || isUpdating }
}
