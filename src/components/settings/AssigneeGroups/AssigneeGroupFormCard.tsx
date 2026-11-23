import { keyframes } from "@emotion/react"
import styled from "@emotion/styled"
import { TbUsersGroup } from "react-icons/tb"
import type { AssigneeGroupDto } from "src/api/model"
import InputWithCount from "src/components/shared/InputWithCount"
import { PrimaryButton } from "src/components/shared/PrimaryButton"
import { TEST_IDS } from "src/consts/test-ids"
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
		<Expand>
			<Clip>
				<Card
					data-testid={TEST_IDS.assigneeGroups.form}
					data-entity-id={assigneeGroup?.id}
				>
					<Header>
						<TbUsersGroup size={24} />
						<InputWithCount
							text={name}
							onChange={setName}
							maxLength={NAME_MAX_LENGTH}
							placeholder="שם הרשימה"
							testId={TEST_IDS.assigneeGroups.formName}
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
						<TextButton
							data-testid={TEST_IDS.assigneeGroups.formCancel}
							type="button"
							onClick={onClose}
						>
							ביטול
						</TextButton>
						<PrimaryButton
							data-testid={TEST_IDS.assigneeGroups.formSave}
							title="שמור"
							height={32}
							width={80}
							disabled={!canSave}
							loading={isPending}
							onClick={handleSave}
						/>
					</Footer>
				</Card>
			</Clip>
		</Expand>
	)
}

const expandDown = keyframes`
  from { grid-template-rows: 0fr; }
  to { grid-template-rows: 1fr; }
`

// Clipping only while animating keeps the card shadow intact afterwards.
const clipWhileExpanding = keyframes`
  from, to { overflow: hidden; }
`

const Expand = styled.div`
  display: grid;
  animation: ${expandDown} 200ms ease-out;
`

const Clip = styled.div`
  min-height: 0;
  animation: ${clipWhileExpanding} 200ms;
`

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
