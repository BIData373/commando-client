import styled from "@emotion/styled"
import { type MouseEvent, useState } from "react"
import { TbPencil, TbTrash } from "react-icons/tb"
import { DeletePopover } from "src/components/Tasks/DeletePopover"
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "src/components/ui/tooltip"
import { useAssigneeGroupDelete } from "src/hooks/useAssigneeGroupDelete"

interface AssigneeGroupActionsProps {
	groupId: number
	onEdit(e: MouseEvent<HTMLButtonElement>): void
}

export function AssigneeGroupActions({
	groupId,
	onEdit,
}: AssigneeGroupActionsProps) {
	const { handleDeleteGroup } = useAssigneeGroupDelete()
	const [isDeleteOpen, setIsDeleteOpen] = useState(false)

	function handleDeleteCloseAutoFocus(e: Event) {
		e.preventDefault()
	}

	function handleOpenDelete(e: MouseEvent<HTMLButtonElement>) {
		e.stopPropagation()
		setIsDeleteOpen(true)
	}

	return (
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
								onOpenChange={setIsDeleteOpen}
								onConfirm={() => handleDeleteGroup(groupId)}
								onCloseAutoFocus={handleDeleteCloseAutoFocus}
								trigger={
									<IconActionButton type="button" onClick={handleOpenDelete}>
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
			<ActionButton type="button" onClick={onEdit}>
				עריכה
				<TbPencil size={14} />
			</ActionButton>
		</>
	)
}

const TooltipAnchor = styled.span`
  display: flex;
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
