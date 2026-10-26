import styled from "@emotion/styled"
import { Plus } from "lucide-react"
import { useState } from "react"
import {
	getListAssigneeGroupsQueryKey,
	useCreateAssigneeGroup,
	useDeleteAssigneeGroup,
	useListAssigneeGroups,
} from "src/api/assignee-group/assignee-group"
import type { AssigneeGroupDto } from "src/api/model"
import { toast } from "src/components/Toast/toast-api"
import {
	deleteAssigneeGroupMessage,
	UNDO_LABEL,
} from "src/functions/toast-messages"
import { useWorkspace } from "src/providers/WorkspaceProvider"
import { invalidateQueries } from "src/query-client"
import { SecondaryButton } from "../../shared/SecondaryButton"
import { SectionTitle } from "../SectionTitle"
import { AssigneeGroupCard } from "./AssigneeGroupCard"
import { AssigneeGroupFormCard } from "./AssigneeGroupFormCard"
import { AssigneeGroupsEmptyState } from "./AssigneeGroupsEmptyState"

/** Fits the card hover shadow (9px offset, 28px blur, 8px spread). */
const SHADOW_ROOM = 24
const NEW_GROUP_FORM = "new"

export function AssigneeGroups() {
	const {
		workspace: { id: workspaceId },
	} = useWorkspace()

	const { data: assigneeGroups = [], isLoading } = useListAssigneeGroups({
		workspaceId,
	})

	const [openFormId, setOpenFormId] = useState<
		number | typeof NEW_GROUP_FORM | null
	>(null)

	const [expandedGroupId, setExpandedGroupId] = useState<number | null>(null)
	const [deletingGroupId, setDeletingGroupId] = useState<number | null>(null)
	const [pendingDeleteIds, setPendingDeleteIds] = useState<number[]>([])

	const { mutate: deleteAssigneeGroup } = useDeleteAssigneeGroup({
		mutation: {
			meta: { toast: { error: true } },
			onSuccess: refreshGroups,
			onError(_error, { pathParams: { id } }) {
				removePendingDelete(id)
			},
		},
	})

	const { mutate: restoreAssigneeGroup } = useCreateAssigneeGroup({
		mutation: {
			meta: { toast: { error: true } },
			onSuccess: refreshGroups,
		},
	})

	const visibleGroups = assigneeGroups.filter(
		({ id }) => !pendingDeleteIds.includes(id),
	)
	const isEmptyState = !isLoading && visibleGroups.length === 0
	const isCreating = openFormId === NEW_GROUP_FORM

	function refreshGroups() {
		invalidateQueries([getListAssigneeGroupsQueryKey({ workspaceId })])
	}

	function removePendingDelete(groupId: number) {
		setPendingDeleteIds((prev) => prev.filter((id) => id !== groupId))
	}

	// There is no restore endpoint, so undo re-creates the group from its last
	// known name and assignees (it comes back with a new id).
	function showDeletedToast({ name, assignees }: AssigneeGroupDto) {
		function handleUndo() {
			restoreAssigneeGroup({
				data: {
					workspaceId,
					name,
					assigneeIds: assignees.map(({ id }) => id),
				},
			})
		}

		toast.success(deleteAssigneeGroupMessage, {
			actions: { variant: "cancel", label: UNDO_LABEL, onClick: handleUndo },
		})
	}

	function handleDeleteGroup(groupId: number) {
		const group = assigneeGroups.find(({ id }) => id === groupId)
		if (!group) return

		setPendingDeleteIds((prev) => [...prev, groupId])
		deleteAssigneeGroup(
			{ pathParams: { id: groupId } },
			{ onSuccess: () => showDeletedToast(group) },
		)
	}

	function handleToggleGroup(groupId: number) {
		if (deletingGroupId !== null) return
		setExpandedGroupId((prev) => (prev === groupId ? null : groupId))
	}

	function handleDeleteOpenChange(groupId: number, open: boolean) {
		setDeletingGroupId(open ? groupId : null)
	}

	function handleOpenCreate() {
		setOpenFormId(NEW_GROUP_FORM)
	}

	function handleEditGroup(groupId: number) {
		setOpenFormId(groupId)
	}

	function handleCloseForm() {
		setOpenFormId(null)
	}

	return (
		<AssigneeGroupsRoot>
			<Header>
				<SectionTitle title="רשימות תפוצה" />
				<Description>
					מאפשר שיוך מהיר של הנחיה למספר אחראים, בקליק אחד.
				</Description>
			</Header>

			{isEmptyState && !isCreating && (
				<AssigneeGroupsEmptyState onOpenCreateDialog={handleOpenCreate} />
			)}

			{!isEmptyState && !isCreating && (
				<AddButton
					onClick={handleOpenCreate}
					height={32}
					title={
						<>
							<Plus size={16} />
							הוספת רשימת תפוצה
						</>
					}
				/>
			)}

			<GroupList>
				{isCreating && <AssigneeGroupFormCard onClose={handleCloseForm} />}
				{visibleGroups.map((assigneeGroup) =>
					assigneeGroup.id === openFormId ? (
						<AssigneeGroupFormCard
							key={assigneeGroup.id}
							assigneeGroup={assigneeGroup}
							onClose={handleCloseForm}
						/>
					) : (
						<AssigneeGroupCard
							key={assigneeGroup.id}
							assigneeGroup={assigneeGroup}
							isExpanded={expandedGroupId === assigneeGroup.id}
							onToggleExpanded={handleToggleGroup}
							isDeleteOpen={deletingGroupId === assigneeGroup.id}
							onDeleteOpenChange={handleDeleteOpenChange}
							onDelete={handleDeleteGroup}
							onEdit={handleEditGroup}
						/>
					),
				)}
			</GroupList>
		</AssigneeGroupsRoot>
	)
}

const AddButton = styled(SecondaryButton)`
  align-self: flex-start;
`

const GroupList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

// overflow-y: auto also clips horizontally, so the cards' shadows need room
// inside the scroll box; the divider-side margin keeps the visual spacing.
const AssigneeGroupsRoot = styled.aside`
  display: flex;
  flex-direction: column;
  gap: 32px;
  width: calc(428px + ${SHADOW_ROOM * 2}px);
  padding-inline: ${SHADOW_ROOM}px;
  padding-block-end: ${SHADOW_ROOM}px;
  margin-inline-start: -${SHADOW_ROOM}px;
  flex-shrink: 0;
  min-height: 0;
  overflow-y: auto;
`

const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`

const Description = styled.p`
  margin: 0 12px;
  font-size: var(--fs-btn);
  line-height: 22px;
  color: var(--sea-ink-soft);
`
