import styled from "@emotion/styled"
import { Check } from "lucide-react"
import type { AssigneeDto } from "src/api/model"
import { TEST_IDS } from "src/consts/test-ids"
import { AssigneeAvatar } from "./AssigneeAvatar"

interface AssigneeOptionProps {
	assignee: AssigneeDto
	selected: boolean
	onToggle(id: number): void
}

export function AssigneeOption({
	assignee,
	selected,
	onToggle,
}: AssigneeOptionProps) {
	function handleClick() {
		onToggle(assignee.id)
	}

	return (
		<OptionButton
			type="button"
			data-testid={TEST_IDS.assigneePicker.option}
			data-entity-id={assignee.id}
			data-selected={selected || undefined}
			$selected={selected}
			onClick={handleClick}
		>
			<OptionContent>
				<AssigneeAvatar assignee={assignee} size={22} />
				<OptionName title={assignee.name} $selected={selected}>
					{assignee.name}
				</OptionName>
			</OptionContent>

			{selected && <SelectedCheck size={18} />}
		</OptionButton>
	)
}

const OptionButton = styled.button<{ $selected: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  flex-shrink: 0;
  border: none;
  background: ${({ $selected }) => ($selected ? "var(--alert-info-bg)" : "transparent")};
  cursor: pointer;
  border-radius: 2px;

  &:hover {
    background: ${({ $selected }) => ($selected ? "var(--alert-info-bg)" : "var(--link-bg-hover)")};
  }
`

const OptionContent = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 12px;
  height: 32px;
  width: 100%;
  min-width: 0;
`

const OptionName = styled.span<{ $selected: boolean }>`
  font-size: var(--fs-btn);
  font-weight: 400;
  line-height: 22px;
  color: ${({ $selected }) => ($selected ? "var(--tab-active-color)" : "var(--text-color-2)")};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const SelectedCheck = styled(Check)`
  flex-shrink: 0;
  color: var(--tab-active-color);
`
