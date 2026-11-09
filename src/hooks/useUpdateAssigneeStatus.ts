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
			onSuccess(_, { pathParams: { id } }) {
				invalidateQueries([
					getListAssigneesQueryKey({ workspaceId }),
					getGetAssigneeQueryKey({ id }),
				])
			},
		},
	})

	function updateAssigneeStatus(
		id: number,
		statusEditable: boolean,
		userId?: number,
	) {
		return mutateAsync({
			pathParams: { id },
			data: { statusEditable, userId },
		})
	}

	return { updateAssigneeStatus }
}
