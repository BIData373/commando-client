import styled from "@emotion/styled"
import { TbUsersGroup } from "react-icons/tb"
import type { AssigneeGroupDto } from "src/api/model"
import { AssigneeAvatar } from "./AssigneeAvatar"

const AVATAR_SIZE = 22

interface AssigneeGroupOptionProps {
	group: AssigneeGroupDto
	onSelect(assigneeIds: number[]): void
	showAvatars?: boolean
}

export function AssigneeGroupOption({
	group,
	onSelect,
	showAvatars = true,
}: AssigneeGroupOptionProps) {
	const { name, assignees } = group

	function handleClick() {
		onSelect(assignees.map((a) => a.id))
	}

	return (
		<OptionButton type="button" onClick={handleClick}>
			<OptionContent>
				<GroupIcon size={18} />
				<GroupName title={name}>'{name}'</GroupName>
			</OptionContent>

			{showAvatars && (
				<Avatars>
					{assignees.map((assignee) => (
						<StackedAvatar key={assignee.id}>
							<AssigneeAvatar assignee={assignee} size={AVATAR_SIZE} />
						</StackedAvatar>
					))}
				</Avatars>
			)}
		</OptionButton>
	)
}

const OptionButton = styled.button`
  display: flex;
  align-items: center;
  width: 100%;
  flex-shrink: 0;
  border: none;
  background: transparent;
  cursor: pointer;
  border-radius: 2px;
  padding: 0 12px;
  height: 32px;
  gap: 8px;

  &:hover {
    background: var(--link-bg-hover);
  }
`

const OptionContent = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
`

const GroupIcon = styled(TbUsersGroup)`
  flex-shrink: 0;
  color: var(--sea-ink-soft);
`

const GroupName = styled.span`
  font-size: var(--fs-btn);
  font-weight: 400;
  line-height: 22px;
  color: var(--text-color-2);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const Avatars = styled.div`
  display: flex;
  align-items: center;
  flex-shrink: 0;
`

const StackedAvatar = styled.span`
  display: flex;

  & + & {
    margin-inline-start: -3px;
  }
`
