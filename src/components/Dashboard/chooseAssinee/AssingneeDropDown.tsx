import styled from "@emotion/styled"
import type { AssigneeDto, AssigneesDto } from "src/api/model"
import { isColorVarDark } from "src/functions/contrast-color"
import { getInitials } from "src/utils/avatar-utils"
import { Checkbox } from "../../ui/checkbox"

interface AssingneeDropDownProps {
	filteredAssignees: AssigneesDto[]
	handleToggle: (id: number) => void
	pendingIds: number[]
}

export default function AssingneeDropDown({
	filteredAssignees,
	handleToggle,
	pendingIds,
}: AssingneeDropDownProps) {
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
						<AssigneeBadge assignee={assignee} />
						<AssigneeName>{assignee.name}</AssigneeName>
					</AssigneeOptionRow>
				</AssigneeOption>
			))}
		</OptionsList>
	)
}
interface AssigneeBadgeProps {
	assignee: AssigneeDto
}

function AssigneeBadge({ assignee }: AssigneeBadgeProps) {
	return (
		<BadgeRoot $color={assignee.color}>{getInitials(assignee.name)}</BadgeRoot>
	)
}

const BadgeRoot = styled.div<{ $color: string | null }>`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: ${({ $color }) => $color ?? "var(--chip-bg)"};
  color: ${({ $color }) => ($color && isColorVarDark($color) ? "white" : "black")};
  font-size: var(--fs-sm);
  font-weight: 400;
  line-height: 20px;
`

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
  gap: 8px;
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
