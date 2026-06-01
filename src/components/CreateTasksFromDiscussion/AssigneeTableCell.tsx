import styled from "@emotion/styled";
import { ChevronDown } from "lucide-react";
import { MOCK_ASSIGNEES } from "src/data/Assignees";
import type {
	TaskRow,
	TaskTableMeta,
} from "../CreateTasksFromDiscussion/TasksColumns";
import { AssigneeAvatar } from "../shared/AssigneeAvatar";
import AssigneePicker from "../shared/AssigneePicker";

interface AssigneeTableCellProps {
	row: TaskRow;
	meta: TaskTableMeta;
}

function AssigneeTableCell({ row, meta }: AssigneeTableCellProps) {
	const assigneeIds = row.assigneeIds;
	const hasMultiple = assigneeIds.length > 1;
	const isExpanded = meta.expandedRows.has(row.id);

	function handleToggleAssignee(assigneeId: number) {
		const isRemoving = assigneeIds.includes(assigneeId);
		const nextIds = isRemoving
			? assigneeIds.filter((id) => id !== assigneeId)
			: [...assigneeIds, assigneeId];

		const nextDetails = isRemoving
			? Object.fromEntries(
				Object.entries(row.assigneeDetails).filter(
					([id]) => Number(id) !== assigneeId,
				),
			)
			: row.assigneeDetails;

		meta.updateRow(row.id, {
			assigneeIds: nextIds,
			assigneeDetails: nextDetails,
		});
	}

	return hasMultiple && !isExpanded ? (
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
				selectedAssignees={assigneeIds}
				onToggle={handleToggleAssignee}
				trigger={
					<CompactTriggerButton type="button">
						<CompactChevron size={16} />

						{hasMultiple ? (
							<CompactAvatarStack>
								{assigneeIds.map((id) =>
									MOCK_ASSIGNEES[id] ? (
										<StackedAssigneeAvatar
											key={id}
											assignee={MOCK_ASSIGNEES[id]}
											size={22}
										/>
									) : null,
								)}
							</CompactAvatarStack>
						) : assigneeIds.length === 1 ? (
							<AssigneeTag>
								<AssigneeTagRole>
									{MOCK_ASSIGNEES[assigneeIds[0]]?.role}
								</AssigneeTagRole>
								<AssigneeAvatar
									assignee={MOCK_ASSIGNEES[assigneeIds[0]]}
									size={18}
								/>
							</AssigneeTag>
						) : (
							<CompactLabel>בחר אחראי</CompactLabel>
						)}
					</CompactTriggerButton>
				}
			/>
		</AssigneeCellOuter>
	);
}

export default AssigneeTableCell;

const AssigneeCellOuter = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
`;

const CollapsedAssigneeButton = styled.button`
  direction: ltr;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  border: none;
  background: transparent;
  cursor: pointer;
`;

const CollapsedAssigneeLabel = styled.span`
  direction: rtl;
  font-size: 14px;
  line-height: 22px;
  color: var(--text-color-2);
  white-space: nowrap;
`;

const CompactTriggerButton = styled.button`
  direction: ltr;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  border: none;
  outline: none;
  background: transparent;
  cursor: pointer;
`;

const CompactChevron = styled(ChevronDown)`
  color: var(--Text-color-text-placeholder);
  flex-shrink: 0;
`;

const CompactLabel = styled.span`
  font-size: 14px;
  line-height: 22px;
  color: var(--Text-color-text-placeholder);
  white-space: nowrap;
  text-align: end;
`;

const CompactAvatarStack = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row-reverse;
`;

const StackedAssigneeAvatar = styled(AssigneeAvatar)`
  margin-inline-start: -14px;

  &:last-of-type {
    margin-inline-start: 0;
  }
`;

const AssigneeTag = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 2px 4px;
`;

const AssigneeTagRole = styled.span`
  font-size: 12px;
  line-height: 20px;
  color: var(--text-color-2);
  white-space: nowrap;
`;
