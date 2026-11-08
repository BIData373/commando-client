import { useQueryClient } from "@tanstack/react-query"
import {
	getListAssigneeGroupsQueryKey,
	useDeleteAssigneeGroup,
} from "src/api/assignee-group/assignee-group"
import type { AssigneeGroupDto } from "src/api/model"
import { toast } from "src/components/Toast/toast-api"
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

		const undone = { current: false }

		function handleUndo() {
			undone.current = true
			queryClient.setQueryData(queryKey, previous)
		}

		toast.success(deleteAssigneeGroupMessage, {
			actions: { variant: "cancel", label: UNDO_LABEL, onClick: handleUndo },
			onDismiss() {
				if (!undone.current) {
					deleteAssigneeGroup({ pathParams: { id: groupId } })
				}
			},
		})
	}

	return { handleDeleteGroup }
}
