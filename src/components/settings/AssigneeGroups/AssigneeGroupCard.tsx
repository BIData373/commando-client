import styled from "@emotion/styled"
import type { MouseEvent } from "react"
import {
	TbChevronDown,
	TbChevronUp,
	TbPencil,
	TbTrash,
	TbUsersGroup,
} from "react-icons/tb"
import type { AssigneeGroupDto } from "src/api/model"
import { AssigneeAvatar } from "src/components/shared/AssigneeAvatar"
import { AssigneeDetailPopover } from "src/components/shared/AssigneeDetailPopover"
import { DeletePopover } from "src/components/Tasks/DeletePopover"
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "src/components/ui/tooltip"

const MAX_VISIBLE_AVATARS = 3
const AVATAR_SIZE = 29
const NO_ASSIGNEES_TEXT = "טרם נוספו אחראים"
const POPOVER_TRIGGER_SELECTOR = '[data-slot="popover-trigger"]'

interface AssigneeGroupCardProps {
	assigneeGroup: AssigneeGroupDto
	isExpanded: boolean
	onToggleExpanded(groupId: number): void
	isDeleteOpen: boolean
	onDeleteOpenChange(groupId: number, open: boolean): void
	onDelete(groupId: number): void
	onEdit(groupId: number): void
}

export function AssigneeGroupCard({
	assigneeGroup,
	isExpanded,
	onToggleExpanded,
	isDeleteOpen,
	onDeleteOpenChange,
	onDelete,
	onEdit,
}: AssigneeGroupCardProps) {
	const { id, name, assignees } = assigneeGroup

	const hasAssignees = assignees.length > 0
	const visibleAssignees = assignees.slice(0, MAX_VISIBLE_AVATARS)
	const hiddenCount = assignees.length - visibleAssignees.length

	// Ignore clicks from portaled popover content and from popover triggers,
	// without stopping propagation so Radix can still close other open popovers
	function handleCardClick(e: MouseEvent<HTMLDivElement>) {
		const target = e.target as Element
		const isFromPortal = !e.currentTarget.contains(target)
		const isPopoverTrigger = target.closest(POPOVER_TRIGGER_SELECTOR)
		if (isFromPortal || isPopoverTrigger) return
		onToggleExpanded(id)
	}

	function handleDeleteOpenChange(open: boolean) {
		onDeleteOpenChange(id, open)
	}

	function handleOpenDelete() {
		onDeleteOpenChange(id, true)
	}

	function handleDeleteConfirm() {
		onDelete(id)
	}

	function handleEditClick(e: MouseEvent<HTMLButtonElement>) {
		e.stopPropagation()
		onEdit(id)
	}

	function handleDeleteCloseAutoFocus(e: Event) {
		e.preventDefault()
	}

	return (
		<Card onClick={handleCardClick}>
			<Header>
				<Title>
					<TbUsersGroup size={24} />
					<Name>‘{name}’</Name>
				</Title>

				<Summary>
					{isExpanded ? (
						<>
							<TooltipProvider>
								<Tooltip>
									<TooltipTrigger asChild>
										<TooltipAnchor>
											<DeletePopover
												count={1}
												title="מחיקת רשימה"
												confirmLabel="מחק"
												side="top"
												align="end"
												showArrow
												open={isDeleteOpen}
												onOpenChange={handleDeleteOpenChange}
												onConfirm={handleDeleteConfirm}
												onCloseAutoFocus={handleDeleteCloseAutoFocus}
												trigger={
													<IconActionButton
														type="button"
														onClick={handleOpenDelete}
													>
														<TbTrash size={14} />
													</IconActionButton>
												}
											/>
										</TooltipAnchor>
									</TooltipTrigger>
									{!isDeleteOpen && (
										<TooltipContent side="top">מחיקת רשימה</TooltipContent>
									)}
								</Tooltip>
							</TooltipProvider>
							<ActionButton type="button" onClick={handleEditClick}>
								עריכה
								<TbPencil size={14} />
							</ActionButton>
						</>
					) : hasAssignees ? (
						<Avatars>
							{visibleAssignees.map((assignee) => (
								<StackedAvatar key={assignee.id}>
									<AssigneeDetailPopover assignee={assignee}>
										<AssigneeAvatar
											assignee={assignee}
											size={AVATAR_SIZE}
											cursor
										/>
									</AssigneeDetailPopover>
								</StackedAvatar>
							))}
							{hiddenCount > 0 && (
								<MoreCount type="button">+{hiddenCount}</MoreCount>
							)}
						</Avatars>
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

			{isExpanded && (
				<>
					<Divider />
					{hasAssignees ? (
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
				</>
			)}
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

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  height: 24px;
  padding-inline: 7px;
  border: none;
  border-radius: 4px;
  background: var(--link-bg-hover);
  color: var(--text-color-2);
  font-size: var(--fs-btn);
  line-height: 22px;
  cursor: pointer;

  &:hover {
    background: var(--button-hover);
  }
`

const IconActionButton = styled(ActionButton)`
  justify-content: center;
  width: 24px;
  padding: 0;
`

const TooltipAnchor = styled.span`
  display: flex;
`

const Divider = styled.div`
  height: 1px;
  background: var(--line);
`

const NoAssigneesText = styled.span`
  font-size: var(--fs-btn);
  line-height: 22px;
  color: var(--text-color);
  white-space: nowrap;
`

const EmptyListText = styled(NoAssigneesText)`
  align-self: center;
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
