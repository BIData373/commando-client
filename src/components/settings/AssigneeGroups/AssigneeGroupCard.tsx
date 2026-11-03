import styled from "@emotion/styled"
import type { MouseEvent } from "react"
import { TbChevronDown, TbChevronUp, TbUsersGroup } from "react-icons/tb"
import type { AssigneeGroupDto } from "src/api/model"
import { AssigneeGroupActions } from "./AssigneeGroupActions"
import { AssigneeGroupAvatars } from "./AssigneeGroupAvatars"
import { AssigneeGroupExpandedList } from "./AssigneeGroupExpandedList"

const MAX_VISIBLE_AVATARS = 3
const NO_ASSIGNEES_TEXT = "טרם נוספו אחראים"
const POPOVER_TRIGGER_SELECTOR = "[data-assignee-popover]"

interface AssigneeGroupCardProps {
	assigneeGroup: AssigneeGroupDto
	isExpanded: boolean
	onToggleExpanded(groupId: number): void
	onEdit(groupId: number): void
}

export function AssigneeGroupCard({
	assigneeGroup: { id, name, assignees },
	isExpanded,
	onToggleExpanded,
	onEdit,
}: AssigneeGroupCardProps) {
	const hasAssignees = assignees.length > 0
	const visibleAssignees = assignees.slice(0, MAX_VISIBLE_AVATARS)
	const hiddenCount = assignees.length - visibleAssignees.length

	function handleCardClick(e: MouseEvent<HTMLDivElement>) {
		const target = e.target as Element
		const isFromPortal = !e.currentTarget.contains(target)
		const isPopoverTrigger = target.closest(POPOVER_TRIGGER_SELECTOR)
		if (isFromPortal || isPopoverTrigger) return
		onToggleExpanded(id)
	}

	function handleEditClick(e: MouseEvent<HTMLButtonElement>) {
		e.stopPropagation()
		onEdit(id)
	}

	return (
		<Card onClick={handleCardClick}>
			<Header>
				<Title>
					<TbUsersGroup size={24} />
					<Name>'{name}'</Name>
				</Title>

				<Summary>
					{isExpanded ? (
						<AssigneeGroupActions groupId={id} onEdit={handleEditClick} />
					) : hasAssignees ? (
						<AssigneeGroupAvatars
							assignees={visibleAssignees}
							hiddenCount={hiddenCount}
						/>
					) : (
						<NoAssigneesText>{NO_ASSIGNEES_TEXT}</NoAssigneesText>
					)}
					<ChevronButton type="button" aria-expanded={isExpanded}>
						{isExpanded ? (
							<TbChevronUp size={14} />
						) : (
							<TbChevronDown size={14} />
						)}
					</ChevronButton>
				</Summary>
			</Header>

			{isExpanded && <AssigneeGroupExpandedList assignees={assignees} />}
		</Card>
	)
}

const Card = styled.div`
  display: flex;
  flex-direction: column;
  align-self: stretch;
  gap: 12px;
  padding: 12px 12px 8px 12px;
  background: var(--background);
  border: 1px solid var(--line);
  border-radius: 8px;
  box-shadow: var(--card-shadow-default);
  cursor: pointer;
  transition: box-shadow 0.2s;

  &:hover {
    box-shadow: var(--card-shadow-hover);
  }
`

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`

const Title = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  color: var(--sea-ink);
`

const Name = styled.span`
  font-size: var(--fs-base);
  font-weight: 500;
  line-height: 32px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const Summary = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
`

const ChevronButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  padding: 0;
  border: none;
  border-radius: 4px;
  background: transparent;
  color: var(--sea-ink-soft);
  cursor: pointer;

  &:hover {
    background: var(--button-hover);
  }
`

const NoAssigneesText = styled.span`
  font-size: var(--fs-btn);
  line-height: 22px;
  color: var(--text-color);
  white-space: nowrap;
`
