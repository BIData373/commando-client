import styled from "@emotion/styled"
import type { AssigneeDto } from "src/api/model"
import { AssigneeAvatar } from "src/components/shared/AssigneeAvatar"

const NO_ASSIGNEES_TEXT = "טרם נוספו אחראים"

interface AssigneeGroupExpandedListProps {
	assignees: AssigneeDto[]
}

export function AssigneeGroupExpandedList({
	assignees,
}: AssigneeGroupExpandedListProps) {
	return (
		<ContentInner>
			<Divider />
			{assignees.length > 0 ? (
				<AssigneeList>
					{assignees.map((assignee) => (
						<AssigneeRow key={assignee.id}>
							<AssigneeAvatar assignee={assignee} size={24} />
							<AssigneeName title={assignee.name}>{assignee.name}</AssigneeName>
						</AssigneeRow>
					))}
				</AssigneeList>
			) : (
				<EmptyListText>{NO_ASSIGNEES_TEXT}</EmptyListText>
			)}
		</ContentInner>
	)
}

const Divider = styled.div`
  height: 1px;
  margin-bottom: 12px;
  background: var(--line);
`

const ContentInner = styled.div`
  padding-top: 12px;
`

const EmptyListText = styled.span`
  display: flex;
  justify-content: center;
  font-size: var(--fs-btn);
  line-height: 22px;
  color: var(--text-color);
  white-space: nowrap;
`

const AssigneeList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 222px;
  overflow-y: auto;
`

const AssigneeRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
`

const AssigneeName = styled.span`
  font-size: var(--fs-btn);
  line-height: 22px;
  color: var(--text-color-2);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`
