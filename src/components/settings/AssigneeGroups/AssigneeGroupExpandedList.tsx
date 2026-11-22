import { keyframes } from "@emotion/react"
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
		<ExpandableContent>
			<ContentInner>
				<Divider />
				{assignees.length > 0 ? (
					<AssigneeList>
						{assignees.map((assignee) => (
							<AssigneeRow key={assignee.id}>
								<AssigneeAvatar assignee={assignee} size={24} />
								<AssigneeName title={assignee.name}>
									{assignee.name}
								</AssigneeName>
							</AssigneeRow>
						))}
					</AssigneeList>
				) : (
					<EmptyListText>{NO_ASSIGNEES_TEXT}</EmptyListText>
				)}
			</ContentInner>
		</ExpandableContent>
	)
}

const Divider = styled.div`
  height: 1px;
  margin-bottom: 12px;
  background: var(--line);
`

const expandDown = keyframes`
  from { grid-template-rows: 0fr; }
  to { grid-template-rows: 1fr; }
`

const ExpandableContent = styled.div`
  display: grid;
  animation: ${expandDown} 200ms ease-out forwards;
`

const ContentInner = styled.div`
  overflow: hidden;
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
