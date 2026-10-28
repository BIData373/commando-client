import styled from "@emotion/styled"
import { ChevronDown } from "lucide-react"
import { useListAssignees } from "src/api/assignee/assignee"
import type { AssigneeDto } from "src/api/model"
import { useWorkspace } from "src/providers/WorkspaceProvider"
import type {
	NewTaskRow,
	TaskTableMeta,
} from "../CreateTasksFromDiscussion/TasksColumns"
import { AssigneeAvatar } from "../shared/AssigneeAvatar"
import AssigneePicker from "../shared/AssigneePicker"

const ASSIGNEE_AVATAR_SIZE = 22

interface AssigneeTableCellProps {
	row: NewTaskRow
	meta: TaskTableMeta
}

function AssigneeTableCell({ row, meta }: AssigneeTableCellProps) {
	const {
		workspace: { id: workspaceId },
	} = useWorkspace()
	const { data: assignees = [], isLoading } = useListAssignees({ workspaceId })

	const assigneeMap = Object.fromEntries(
		assignees.map((a) => [a.id, a]),
	) as Record<number, AssigneeDto>

	const assigneeIds = row.assigneeIds
	const hasMultiple = assigneeIds.length > 1
	const isExpanded = meta.expandedRows.has(row.id)

	function handleToggleAssignee(assigneeId: number) {
		const isRemoving = assigneeIds.includes(assigneeId)
		const nextIds = isRemoving
			? assigneeIds.filter((id) => id !== assigneeId)
			: [...assigneeIds, assigneeId]

		const nextDetails = isRemoving
			? Object.fromEntries(
					Object.entries(row.assigneeDetails).filter(
						([id]) => Number(id) !== assigneeId,
					),
				)
			: row.assigneeDetails

		meta.updateRow(row.id, {
			assigneeIds: nextIds,
			assigneeDetails: nextDetails,
		})
	}

	return hasMultiple && !isExpanded && !isLoading ? (
		<CollapsedAssigneeButton
			type="button"
			onClick={() => meta.toggleRowExpansion(row.id)}
		>
			<ChevronDown size={16} />
			<CollapsedAssigneeLabel>
				{assigneeIds.length} אחראים
			</CollapsedAssigneeLabel>
		</CollapsedAssigneeButton>
	) : (
		<AssigneeCellOuter>
			<AssigneePicker
				workspaceId={workspaceId}
				selectedAssignees={assigneeIds}
				onToggle={handleToggleAssignee}
				trigger={({ search, onSearchChange, open }) => (
					<CompactTriggerButton type="button">
						<CompactChevron size={16} />

						{open || assigneeIds.length === 0 ? (
							<CompactSearchInput
								value={search}
								onChange={onSearchChange}
								placeholder="בחר אחראי"
								dir="rtl"
								autoFocus={open}
							/>
						) : hasMultiple ? (
							<CompactAvatarStack>
								{assigneeIds.map((id) =>
									assigneeMap[id] ? (
										<StackedAssigneeAvatar
											key={id}
											assignee={assigneeMap[id]}
											size={ASSIGNEE_AVATAR_SIZE}
										/>
									) : null,
								)}
							</CompactAvatarStack>
						) : assigneeMap[assigneeIds[0]] ? (
							<AssigneeTag>
								<AssigneeAvatar
									assignee={assigneeMap[assigneeIds[0]]}
									size={ASSIGNEE_AVATAR_SIZE}
								/>
								<AssigneeTagName>
									{assigneeMap[assigneeIds[0]].name}
								</AssigneeTagName>
							</AssigneeTag>
						) : null}
					</CompactTriggerButton>
				)}
			/>
		</AssigneeCellOuter>
	)
}

export default AssigneeTableCell

const AssigneeCellOuter = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
`

const CollapsedAssigneeButton = styled.button`
  direction: ltr;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  padding-inline: 12px;
  border: none;
  background: transparent;
  cursor: pointer;
`

const CollapsedAssigneeLabel = styled.span`
  direction: rtl;
  font-size: var(--fs-btn);
  line-height: 22px;
  color: var(--text-color-2);
  white-space: nowrap;
`

const CompactTriggerButton = styled.button`
  direction: ltr;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  padding-inline: 12px;
  border: none;
  outline: none;
  background: transparent;
  cursor: pointer;
`

const CompactChevron = styled(ChevronDown)`
  color: var(--Text-color-text-placeholder);
  flex-shrink: 0;
`

const CompactSearchInput = styled.input`
  flex: 1;
  min-width: 0;
  font-size: var(--fs-btn);
  line-height: 22px;
  color: var(--text-color-2);
  text-align: start;
  border: none;
  outline: none;
  background: transparent;

  &::placeholder {
    color: var(--Text-color-text-placeholder);
  }
`

const CompactAvatarStack = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row-reverse;
`

const StackedAssigneeAvatar = styled(AssigneeAvatar)`
  margin-inline-start: -14px;

  &:last-of-type {
    margin-inline-start: 0;
  }
`

const AssigneeTag = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 4px;
  padding: 2px 4px;
  width: 100%;
  min-width: 0;
  direction: rtl;
`

const AssigneeTagName = styled.span`
  font-size: var(--fs-sm);
  line-height: 20px;
  color: var(--text-color-2);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0;
  direction: rtl;
`
