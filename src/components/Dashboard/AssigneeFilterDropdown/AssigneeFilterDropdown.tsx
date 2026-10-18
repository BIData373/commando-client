import styled from "@emotion/styled"
import { CircleUser } from "lucide-react"
import { useListAssignees } from "src/api/assignee/assignee"
import { AssigneeAvatar } from "src/components/shared/AssigneeAvatar"
import { FilterDropdown } from "src/components/shared/FilterDropdown"

interface AssigneeFilterDropdownProps {
	workspaceId: number
	selectedIds: number[]
	onApply: (ids: number[]) => void
}

function AssigneeFilterDropdown({
	workspaceId,
	selectedIds,
	onApply,
}: AssigneeFilterDropdownProps) {
	const { data: assignees = [] } = useListAssignees({ workspaceId })

	const options = assignees.map((assignee) => ({
		value: assignee.id,
		label: assignee.name,
		icon: <AssigneeAvatar assignee={assignee} />,
	}))

	return (
		<FilterDropdown
			options={options}
			activeValues={selectedIds}
			onApply={onApply}
			searchPlaceholder="חפש אחראי"
		>
			<TriggerButton $active={selectedIds.length > 0}>
				<CircleUser size={18} />
				{selectedIds.length > 0 ? (
					<TriggerLabel>אחראי ({selectedIds.length})</TriggerLabel>
				) : (
					<TriggerLabel>סינון אחראי</TriggerLabel>
				)}
			</TriggerButton>
		</FilterDropdown>
	)
}

export { AssigneeFilterDropdown }

// ─── Styled ─────────────────────────────────────────────────────────────────

const TriggerButton = styled.button<{ $active: boolean }>`
  direction: rtl;
  display: flex;
  padding: 0 15px;
  justify-content: center;
  align-items: center;
  gap: 8px;
  height: 40px;
  border-radius: 8px;
  border: 1px solid ${({ $active }) => ($active ? "var(--active-color-button)" : "var(--card-border)")};
  background: var(--background);
  box-shadow: var(--shadow-button);
  cursor: pointer;
  white-space: nowrap;
  color: ${({ $active }) => ($active ? "var(--active-color-button)" : "var(--text-color-2)")};
  font-size: var(--fs-base);

  &:hover {
    border-color: ${({ $active }) => ($active ? "var(--active-color-button)" : "var(--button-color-hover)")};
    color: ${({ $active }) => ($active ? "var(--active-color-button)" : "var(--button-color-hover)")};
  }
`

const TriggerLabel = styled.span`
  font-size: var(--fs-base);
`
