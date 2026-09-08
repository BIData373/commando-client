import { type CreateTaskDto, DeadlineType } from "src/api/model"
import {
	createTaskMessage,
	reportBatch,
	runBatch,
	showFailureToast,
	TECHNICAL_FAILURE,
	updateTaskMessage,
} from "src/functions/toasts"
import { invalidateQueries } from "src/query-client"
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

		if (created.succeeded + updated.succeeded > 0) {
			invalidateQueries([
				getListTaskRowsQueryKey({ workspaceId }),
				getListPersonalTaskRowsQueryKey(),
				getListTagsQueryKey(),
			])

			onDone?.()
		}

		reportBatch(created, { message: createTaskMessage, failure: false })
		reportBatch(updated, { message: updateTaskMessage, failure: false })

		if (created.failed + updated.failed > 0) {
			showFailureToast(TECHNICAL_FAILURE)
		}
	}

	return { saveTasks, isPending: isCreating || isUpdating }
}
