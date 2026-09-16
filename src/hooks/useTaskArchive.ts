import type { QueryKey } from "@tanstack/react-query"
import { useToggleUserTaskArchive } from "src/api/archived-user-assignee-task/archived-user-assignee-task"
import { useToggleWorkspaceTaskArchive } from "src/api/archived-workspace-assignee/archived-workspace-assignee"
import {
	getGetTaskQueryKey,
	getListPersonalTaskRowsQueryKey,
	getListTaskRowsQueryKey,
} from "src/api/task/task"
import { toast } from "src/components/Toast/toast-api"
import {
	ARCHIVE_FAILED,
	archiveTaskMessage,
	UNDO_ARCHIVE_FAILED,
	UNDO_LABEL,
	unarchiveTaskMessage,
} from "src/functions/toast-messages"
import { invalidateQueries } from "src/query-client"
import { runBatch } from "src/utils/batch-utils"
import type { TaskArchiveEntry } from "./useTaskColumns"

interface TaskArchiveOptions {
	/** The list query the calling page renders, invalidated after every toggle. */
	listQueryKey: QueryKey
	/** Given, the workspace endpoint is used; omitted, the personal one is. */
	workspaceId?: number
}

const MISSING_ASSIGNEE = "Task has no assignee to archive"

export function useTaskArchive({
	listQueryKey,
	workspaceId,
}: TaskArchiveOptions) {
	const { mutateAsync: toggleUserArchive } = useToggleUserTaskArchive()

	const { mutateAsync: toggleWorkspaceArchive } =
		useToggleWorkspaceTaskArchive()

	async function toggleEntry({ id, assigneeId }: TaskArchiveEntry) {
		if (workspaceId !== undefined) {
			return toggleWorkspaceArchive({ params: { taskId: id, assigneeId } })
		}

		// The personal endpoint requires an assignee. Without one there is nothing
		// to toggle, so the entry has to count as failed rather than silently
		// resolve and be reported as archived.
		if (assigneeId === undefined) {
			throw new Error(MISSING_ASSIGNEE)
		}

		return toggleUserArchive({ params: { taskId: id, assigneeId } })
	}

	async function toggleEntries(entries: TaskArchiveEntry[]) {
		const result = await runBatch(entries, toggleEntry)

		invalidateQueries([
			listQueryKey,
			getListPersonalTaskRowsQueryKey(),
			...(workspaceId !== undefined
				? [getListTaskRowsQueryKey({ workspaceId })]
				: []),
			...entries.map(({ id }) => getGetTaskQueryKey({ id })),
		])

		return result
	}

	async function cancelArchive(entries: TaskArchiveEntry[]) {
		const restored = await toggleEntries(entries)

		if (restored.failed > 0) {
			toast.failure(UNDO_ARCHIVE_FAILED)
		}
	}

	async function archive(entries: TaskArchiveEntry[]) {
		const archived = await toggleEntries(entries)

		toast.batch(archived, {
			message: archiveTaskMessage,
			failure: ARCHIVE_FAILED,
			options: {
				actions: {
					variant: "cancel",
					label: UNDO_LABEL,
					onClick: () => {
						cancelArchive(entries)
					},
				},
			},
		})
	}

	async function unarchive(entries: TaskArchiveEntry[]) {
		const restored = await toggleEntries(entries)

		toast.batch(restored, {
			message: unarchiveTaskMessage,
			failure: UNDO_ARCHIVE_FAILED,
		})
	}

	return { archive, unarchive }
}
