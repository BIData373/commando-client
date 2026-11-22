import { keyframes } from "@emotion/react"
import styled from "@emotion/styled"
import { Accordion } from "radix-ui"
import type { MouseEvent } from "react"
import { TbChevronDown, TbUsersGroup } from "react-icons/tb"
import type { AssigneeGroupDto } from "src/api/model"
import { getVisibleAvatars } from "src/functions/avatar-overflow"
import { STATE_CLOSED, STATE_OPEN } from "src/functions/radix-state"
import { AssigneeGroupActions } from "./AssigneeGroupActions"
import { AssigneeGroupAvatars } from "./AssigneeGroupAvatars"
import { AssigneeGroupExpandedList } from "./AssigneeGroupExpandedList"

const NO_ASSIGNEES_TEXT = "טרם נוספו אחראים"
const INTERACTIVE_SELECTOR =
	"button:not([data-chevron]), a, [data-assignee-popover]"

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
	const { visible: visibleAssignees, hiddenCount } =
		getVisibleAvatars(assignees)

	// Portal content (delete popover, assignee popover) bubbles through React
	// but sits outside the card DOM, so it must not toggle the card either.
	function handleCardClick(e: MouseEvent<HTMLDivElement>) {
		const target = e.target as Element
		const isFromPortal = !e.currentTarget.contains(target)
		if (isFromPortal || target.closest(INTERACTIVE_SELECTOR)) return
		onToggleExpanded(id)
	}

	function handleEdit() {
		onEdit(id)
	}

	return (
		<Card value={String(id)} onClick={handleCardClick}>
			<Header>
				<Title>
					<TbUsersGroup size={24} />
					<Name>'{name}'</Name>
				</Title>

				<Summary>
					{isExpanded ? (
						<AssigneeGroupActions groupId={id} onEdit={handleEdit} />
					) : hasAssignees ? (
						<AssigneeGroupAvatars
							assignees={visibleAssignees}
							hiddenCount={hiddenCount}
						/>
					) : (
						<NoAssigneesText>{NO_ASSIGNEES_TEXT}</NoAssigneesText>
					)}
					<ChevronTrigger data-chevron>
						<TbChevronDown size={14} />
					</ChevronTrigger>
				</Summary>
			</Header>

			<Content>
				<AssigneeGroupExpandedList assignees={assignees} />
			</Content>
		</Card>
	)
}

const Card = styled(Accordion.Item)`
  display: flex;
  flex-direction: column;
  align-self: stretch;
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

const Header = styled(Accordion.Header)`
  margin: 0;
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

const ChevronTrigger = styled(Accordion.Trigger)`
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

  & > svg {
    transition: transform 0.2s;
  }

  ${STATE_OPEN} > svg {
    transform: rotate(180deg);
  }

  &:hover {
    background: var(--button-hover);
  }
`

const slideDown = keyframes`
  from { height: 0; }
  to { height: var(--radix-accordion-content-height); }
`

const slideUp = keyframes`
  from { height: var(--radix-accordion-content-height); }
  to { height: 0; }
`

const Content = styled(Accordion.Content)`
  overflow: hidden;
  cursor: default;

  ${STATE_OPEN} {
    animation: ${slideDown} 200ms ease-out;
  }

  ${STATE_CLOSED} {
    animation: ${slideUp} 200ms ease-out;
  }
`

const NoAssigneesText = styled.span`
  font-size: var(--fs-btn);
  line-height: 22px;
  color: var(--text-color);
  white-space: nowrap;
`
