import { useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { useListAssignees } from "src/api/assignee/assignee"
import {
	getListAssigneeGroupsQueryKey,
	useCreateAssigneeGroup,
	useUpdateAssigneeGroup,
} from "src/api/assignee-group/assignee-group"
import type { AssigneeGroupDto } from "src/api/model"
import {
	createAssigneeGroupMessage,
	updateAssigneeGroupMessage,
} from "src/functions/toast-messages"
import { useWorkspace } from "src/providers/WorkspaceProvider"
import { invalidateQueries } from "src/query-client"

export function useAssigneeGroupForm(
	assigneeGroup: AssigneeGroupDto | undefined,
	onClose: () => void,
) {
	const {
		workspace: { id: workspaceId },
	} = useWorkspace()

	const [name, setName] = useState(assigneeGroup?.name ?? "")
	const [selectedIds, setSelectedIds] = useState<number[]>(
		assigneeGroup?.assignees.map(({ id }) => id) ?? [],
	)

	const canSave =
		name.trim().length > 0 && (!assigneeGroup || hasChanges(assigneeGroup))

	const queryClient = useQueryClient()
	const queryKey = getListAssigneeGroupsQueryKey({ workspaceId })

	const { data: assignees = [] } = useListAssignees({ workspaceId })
	const selectedAssignees = assignees.filter((a) => selectedIds.includes(a.id))

	function optimisticMutation(
		updater: (old: AssigneeGroupDto[]) => Partial<AssigneeGroupDto>[],
		toast: { success: string },
	) {
		return {
			meta: { toast: { ...toast, error: true as const } },
			onMutate: () => {
				const previous = queryClient.getQueryData<AssigneeGroupDto[]>(queryKey)
				queryClient.setQueryData<AssigneeGroupDto[]>(
					queryKey,
					(old = []) => updater(old) as AssigneeGroupDto[],
				)
				onClose()
				return { previous }
			},
			onError: (
				_error: unknown,
				_variables: unknown,
				context: { previous?: AssigneeGroupDto[] } | undefined,
			) => {
				if (context?.previous) {
					queryClient.setQueryData(queryKey, context.previous)
				}
			},
			onSettled: () => {
				invalidateQueries([queryKey])
			},
		}
	}

	const { mutate: createAssigneeGroup, isPending: isCreatePending } =
		useCreateAssigneeGroup({
			mutation: optimisticMutation(
				(old) => [
					...old,
					{
						id: -Date.now(),
						name: name.trim(),
						workspaceId,
						assignees: selectedAssignees,
					},
				],
				{ success: createAssigneeGroupMessage },
			),
		})

	const { mutate: updateAssigneeGroup, isPending: isUpdatePending } =
		useUpdateAssigneeGroup({
			mutation: optimisticMutation(
				(old) =>
					old.map((group) =>
						group.id === assigneeGroup?.id
							? {
									...group,
									name: name.trim(),
									assignees: selectedAssignees,
								}
							: group,
					),
				{ success: updateAssigneeGroupMessage },
			),
		})

	function hasChanges({ name: initialName, assignees }: AssigneeGroupDto) {
		const initialIds = assignees.map(({ id }) => id)

		return (
			name.trim() !== initialName ||
			selectedIds.length !== initialIds.length ||
			selectedIds.some((id) => !initialIds.includes(id))
		)
	}

	function handleToggleAssignee(id: number) {
		setSelectedIds((prev) =>
			prev.includes(id)
				? prev.filter((selectedId) => selectedId !== id)
				: [...prev, id],
		)
	}

	function handleSave() {
		const values = { name: name.trim(), assigneeIds: selectedIds }

		if (assigneeGroup) {
			updateAssigneeGroup({
				pathParams: { id: assigneeGroup.id },
				data: values,
			})
			return
		}

		createAssigneeGroup({ data: { workspaceId, ...values } })
	}

	return {
		name,
		setName,
		assignees,
		selectedIds,
		canSave,
		isPending: isCreatePending || isUpdatePending,
		handleToggleAssignee,
		handleSave,
	}
}
