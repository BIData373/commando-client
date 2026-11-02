import styled from "@emotion/styled"
import { TbUsersGroup } from "react-icons/tb"
import type { AssigneeGroupDto } from "src/api/model"
import InputWithCount from "src/components/shared/InputWithCount"
import { PrimaryButton } from "src/components/shared/PrimaryButton"
import { useAssigneeGroupForm } from "src/hooks/useAssigneeGroupForm"
import { AssigneeSearchList } from "./AssigneeSearchList"

const NAME_MAX_LENGTH = 30

interface AssigneeGroupFormCardProps {
	/** Given, the form edits this group; omitted, it creates a new one. */
	assigneeGroup?: AssigneeGroupDto
	onClose(): void
}

export function AssigneeGroupFormCard({
	assigneeGroup,
	onClose,
}: AssigneeGroupFormCardProps) {
	const {
		name,
		setName,
		assignees,
		selectedIds,
		canSave,
		isPending,
		handleToggleAssignee,
		handleSave,
	} = useAssigneeGroupForm(assigneeGroup, onClose)

	return (
		<Card>
			<Header>
				<TbUsersGroup size={24} />
				<InputWithCount
					text={name}
					onChange={setName}
					maxLength={NAME_MAX_LENGTH}
					placeholder="שם הרשימה"
				/>
			</Header>

			<Divider />

			<AssigneeSearchList
				assignees={assignees}
				selectedIds={selectedIds}
				onToggle={handleToggleAssignee}
			/>

			<Divider />

			<Footer>
				<TextButton type="button" onClick={onClose}>
					ביטול
				</TextButton>
				<PrimaryButton
					title="שמור"
					height={32}
					width={80}
					disabled={!canSave}
					loading={isPending}
					onClick={handleSave}
				/>
			</Footer>
		</Card>
	)
}

const Card = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 12px 12px 8px;
  background: var(--background);
  border: 1px solid var(--line);
  border-radius: 8px;
  box-shadow: var(--card-shadow-default);
`

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  align-self: stretch;
  color: var(--sea-ink);
`

const Divider = styled.div`
  height: 1px;
  background: var(--button-hover);
`

const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const TextButton = styled.button`
  height: 32px;
  padding-inline: 15px;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: var(--text-color-2);
  font-size: var(--fs-btn);
  line-height: 22px;
  cursor: pointer;

  &:hover {
    background: var(--button-hover);
  }
`
