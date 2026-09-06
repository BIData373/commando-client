import { type CreateTaskDto, DeadlineType } from "src/api/model"
import { toast } from "src/components/Toast/toast-api"
import type { AppMutationMeta } from "src/functions/toasts"
import {
	MutationFailure,
	MutationSuccess,
	showFailureToast,
	withCount,
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

export function useSaveTasks(workspaceId: number, onDone?: () => void) {
	// Each row is saved with its own mutation, so per-row toasts are suppressed
	// and the batch reports one aggregated result below.
	const mutationCallbacks = {
		meta: { toast: { success: false, error: false } } satisfies AppMutationMeta,
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

	async function saveTasks(inputs: TaskInput[]) {
		const saved = { created: 0, updated: 0 }

		const results = await Promise.allSettled(
			inputs.map(async ({ deadlineType, title, taskId, ...input }) => {
				const data = {
					title: title.trim(),
					deadlineType: deadlineType ?? DeadlineType.ROLLING,
					dueDate: input.dueDate ?? null,
					...input,
				}

				if (taskId !== undefined) {
					await updateTask({ pathParams: { id: taskId }, data })
					saved.updated += 1
					return
				}

				await createTask({ data })
				saved.created += 1
			}),
		)

		if (saved.created > 0) {
			toast.success(
				withCount(
					saved.created,
					MutationSuccess.CreateGuideline,
					MutationSuccess.CreateGuidelines,
				),
			)
		}

		if (saved.updated > 0) {
			toast.success(
				withCount(
					saved.updated,
					MutationSuccess.UpdateGuideline,
					MutationSuccess.UpdateGuidelines,
				),
			)
		}

		if (results.some(({ status }) => status === "rejected")) {
			showFailureToast(MutationFailure.TechnicalFailure)
		}
	}

	return { saveTasks, isPending: isCreating || isUpdating }
}
