import styled from "@emotion/styled"
import type { AssigneeDto } from "src/api/model"
import { AssigneeAvatar } from "src/components/shared/AssigneeAvatar"
import { AssigneeDetailPopover } from "src/components/shared/AssigneeDetailPopover"

const AVATAR_SIZE = 29

interface AssigneeGroupAvatarsProps {
	assignees: AssigneeDto[]
	hiddenCount: number
}

export function AssigneeGroupAvatars({
	assignees,
	hiddenCount,
}: AssigneeGroupAvatarsProps) {
	return (
		<Avatars>
			{assignees.map((assignee) => (
				<StackedAvatar key={assignee.id} data-assignee-popover>
					<AssigneeDetailPopover assignee={assignee}>
						<AssigneeAvatar assignee={assignee} size={AVATAR_SIZE} cursor />
					</AssigneeDetailPopover>
				</StackedAvatar>
			))}
			{hiddenCount > 0 && <MoreCount type="button">+{hiddenCount}</MoreCount>}
		</Avatars>
	)
}

const Avatars = styled.div`
  display: flex;
  align-items: center;
`

const StackedAvatar = styled.span`
  display: flex;

  & + & {
    margin-inline-start: -3px;
  }
`

const MoreCount = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${AVATAR_SIZE}px;
  height: ${AVATAR_SIZE}px;
  margin-inline-start: -3px;
  padding: 0;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  background: var(--chip-bg);
  color: var(--text-color-2);
  font-size: var(--fs-sm);
  line-height: 20px;
`
