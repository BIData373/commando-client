import { type CreateTaskDto, DeadlineType } from "src/api/model"
import {
	MutationFailure,
	MutationSuccess,
	reportBatch,
	runBatch,
	SILENT_MUTATION_META,
	showFailureToast,
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
	// Each row is saved with its own mutation; `saveTasks` reports the batch.
	const { mutateAsync: createTask, isPending: isCreating } = useCreateTask({
		mutation: { meta: SILENT_MUTATION_META },
	})

	const { mutateAsync: updateTask, isPending: isUpdating } = useUpdateTask({
		mutation: { meta: SILENT_MUTATION_META },
	})

	async function saveTasks(inputs: TaskInput[]) {
		const [created, updated] = await Promise.all([
			runBatch(
				inputs.filter((input) => !isUpdate(input)),
				(input) => createTask({ data: toTaskData(input) }),
			),
			runBatch(inputs.filter(isUpdate), ({ taskId, ...input }) =>
				updateTask({
					pathParams: { id: taskId },
					data: toTaskData(input as TaskInput),
				}),
			),
		])

		// Invalidate once for the whole batch rather than once per row, which
		// would cancel and restart the same three refetches N times over.
		if (created.succeeded + updated.succeeded > 0) {
			invalidateQueries([
				getListTaskRowsQueryKey({ workspaceId }),
				getListPersonalTaskRowsQueryKey(),
				getListTagsQueryKey(),
			])

			onDone?.()
		}

		// Both batches share one failure toast, so neither raises its own.
		reportBatch(created, {
			singular: MutationSuccess.CreateGuideline,
			plural: MutationSuccess.CreateGuidelines,
			failure: false,
		})
		reportBatch(updated, {
			singular: MutationSuccess.UpdateGuideline,
			plural: MutationSuccess.UpdateGuidelines,
			failure: false,
		})

		if (created.failed + updated.failed > 0) {
			showFailureToast(MutationFailure.TechnicalFailure)
		}
	}

	return { saveTasks, isPending: isCreating || isUpdating }
}
