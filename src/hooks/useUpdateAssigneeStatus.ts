import {
	getGetAssigneeQueryKey,
	getListAssigneesQueryKey,
	useUpdateAssigneeStatusEditable,
} from "src/api/assignee/assignee"
import { invalidateQueries } from "src/query-client"

export function useUpdateAssigneeStatus(workspaceId: number) {
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
