import styled from "@emotion/styled"
import { Plus } from "lucide-react"
import { useState } from "react"
import { useListAssigneeGroups } from "src/api/assignee-group/assignee-group"
import { useWorkspace } from "src/providers/WorkspaceProvider"
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

	const isEmptyState = !isLoading && assigneeGroups.length === 0
	const isCreating = openFormId === NEW_GROUP_FORM

	function handleToggleGroup(groupId: number) {
		setExpandedGroupId((prev) => (prev === groupId ? null : groupId))
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
				{assigneeGroups.map((assigneeGroup) =>
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
