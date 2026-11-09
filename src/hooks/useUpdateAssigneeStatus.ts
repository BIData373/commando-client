import {
	getGetAssigneeQueryKey,
	getListAssigneesQueryKey,
	useUpdateAssigneeStatusEditable,
} from "src/api/assignee/assignee"
import { useWorkspace } from "src/providers/WorkspaceProvider"
import { invalidateQueries } from "src/query-client"

export function useUpdateAssigneeStatus() {
	const {
		workspace: { id: workspaceId },
	} = useWorkspace()

	const { mutateAsync } = useUpdateAssigneeStatusEditable({
		mutation: {
			onSuccess(_, { params: { assigneeId } }) {
				invalidateQueries([
					getListAssigneesQueryKey({ workspaceId }),
					getGetAssigneeQueryKey({ id: assigneeId }),
				])
			},
		},
	})

	function updateAssigneeStatus(
		assigneeId: number,
		statusEditable: boolean,
		userId?: number,
	) {
		return mutateAsync({ params: { assigneeId, statusEditable, userId } })
	}

	return { updateAssigneeStatus }
}
