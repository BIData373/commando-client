import styled from "@emotion/styled"
import type { AssigneesDto } from "src/api/model"
import { AssigneeAvatar } from "src/components/shared/AssigneeAvatar"
import { Checkbox } from "../../ui/checkbox"

interface AssigneeDropdownProps {
	filteredAssignees: AssigneesDto[]
	handleToggle: (id: number) => void
	pendingIds: number[]
}

export default function AssigneeDropdown({
	filteredAssignees,
	handleToggle,
	pendingIds,
}: AssigneeDropdownProps) {
	return (
		<OptionsList>
			{filteredAssignees.map((assignee) => (
				<AssigneeOption
					key={assignee.id}
					onClick={() => handleToggle(assignee.id)}
				>
					<AssigneeOptionRow>
						<Checkbox
							checked={pendingIds.includes(assignee.id)}
							onCheckedChange={() => handleToggle(assignee.id)}
							onClick={(e) => e.stopPropagation()}
						/>
						<AssigneeAvatar assignee={assignee} />
						<AssigneeName>{assignee.name}</AssigneeName>
					</AssigneeOptionRow>
				</AssigneeOption>
			))}
		</OptionsList>
	)
}

// ─── Styled ─────────────────────────────────────────────────────────────────

const OptionsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 8px;
  max-height: 220px;
  overflow-y: scroll;
  direction: ltr;
`

const AssigneeOption = styled.button`
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 32px;
  padding: 0 12px;
  border: none;
  border-radius: 4px;
  background: transparent;
  cursor: pointer;

  &:hover {
    background: var(--link-bg-hover);
  }
`

const AssigneeOptionRow = styled.div`
  direction: rtl;
  display: flex;
  align-items: center;
  align-self: flex-end;
  gap: 8px;
  width: 100%;
`

const AssigneeName = styled.span`
	flex: 1;
	min-width: 0;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	text-align: right;
	font-size: var(--fs-btn);
	line-height: 22px;
	color: var(--text-color-2);
`
