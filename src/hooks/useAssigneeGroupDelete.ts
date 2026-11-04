import { useQueryClient } from "@tanstack/react-query"
import { useRef } from "react"
import {
	getListAssigneeGroupsQueryKey,
	useDeleteAssigneeGroup,
} from "src/api/assignee-group/assignee-group"
import type { AssigneeGroupDto } from "src/api/model"
import {
	DEFAULT_TOAST_DURATION_MS,
	toast,
} from "src/components/Toast/toast-api"
import {
	deleteAssigneeGroupMessage,
	UNDO_LABEL,
} from "src/functions/toast-messages"
import { useWorkspace } from "src/providers/WorkspaceProvider"
import { invalidateQueries } from "src/query-client"

export function useAssigneeGroupDelete() {
	const {
		workspace: { id: workspaceId },
	} = useWorkspace()

	const queryClient = useQueryClient()
	const queryKey = getListAssigneeGroupsQueryKey({ workspaceId })
	const pendingDeletes = useRef<Map<number, ReturnType<typeof setTimeout>>>(
		new Map(),
	)

	const { mutate: deleteAssigneeGroup } = useDeleteAssigneeGroup({
		mutation: {
			meta: { toast: { error: true } },
			onSettled() {
				invalidateQueries([queryKey])
			},
		},
	})

	function handleDeleteGroup(groupId: number) {
		const previous = queryClient.getQueryData<AssigneeGroupDto[]>(queryKey)
		queryClient.setQueryData<AssigneeGroupDto[]>(queryKey, (old = []) =>
			old.filter((group) => group.id !== groupId),
		)

		const timeoutId = setTimeout(() => {
			pendingDeletes.current.delete(groupId)
			deleteAssigneeGroup({ pathParams: { id: groupId } })
		}, DEFAULT_TOAST_DURATION_MS)

		pendingDeletes.current.set(groupId, timeoutId)

		function handleUndo() {
			clearTimeout(timeoutId)
			pendingDeletes.current.delete(groupId)
			queryClient.setQueryData(queryKey, previous)
		}

		toast.success(deleteAssigneeGroupMessage, {
			actions: { variant: "cancel", label: UNDO_LABEL, onClick: handleUndo },
		})
	}

	return { handleDeleteGroup }
}
