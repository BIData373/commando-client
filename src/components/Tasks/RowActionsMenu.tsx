import styled from "@emotion/styled"
import { CheckCircle2, MoreVertical, Pencil, Trash2 } from "lucide-react"
import { type ReactNode, useState } from "react"
import { PermissionType } from "src/api/model"
import { useGetMyPermission } from "src/api/permission/permission"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import { DeletePopover } from "./DeletePopover"

interface RowActionsMenuProps {
	trigger?: ReactNode
	workspaceId: number
	onEdit?: () => void
	onEnterSelect?: () => void
	onDelete?: () => void
}

export function RowActionsMenu({
	trigger,
	workspaceId,
	onEdit,
	onEnterSelect,
	onDelete,
}: RowActionsMenuProps) {
	const { data: myPermission } = useGetMyPermission({ workspaceId })

	const hasPermission = (permission: PermissionType, func?: () => void) =>
		myPermission?.type === permission && func

	const handleEdit = hasPermission(PermissionType.MANAGER, onEdit)
	const handleDelete = hasPermission(PermissionType.MANAGER, onDelete)

	const [dropdownOpen, setDropdownOpen] = useState(false)
	const [popoverOpen, setPopoverOpen] = useState(false)

	const itemCount = [onEnterSelect, handleEdit, handleDelete].filter(
		Boolean,
	).length
	const hasMoreThanTwo = itemCount >= 2

	function handleDropdownOpenChange(open: boolean) {
		if (!open && popoverOpen) return
		setDropdownOpen(open)
	}

	function handleDeleteClick() {
		setPopoverOpen(true)
	}

	function handlePopoverOpenChange(open: boolean) {
		setPopoverOpen(open)
		if (!open) setDropdownOpen(false)
	}

	return (
		itemCount > 0 && (
			<DropdownMenu
				open={dropdownOpen || popoverOpen}
				onOpenChange={handleDropdownOpenChange}
			>
				<DropdownMenuTrigger asChild>
					{trigger ?? (
						<DefaultTrigger>
							<MoreVertical size={16} />
						</DefaultTrigger>
					)}
				</DropdownMenuTrigger>
				<MenuContent align="start" sideOffset={4}>
					{handleEdit && (
						<MenuItem onSelect={handleEdit}>
							<Pencil size={16} />
							עריכה
						</MenuItem>
					)}
					{onEnterSelect && (
						<MenuItem onSelect={onEnterSelect}>
							<CheckCircle2 size={16} />
							סמן
						</MenuItem>
					)}
					{hasMoreThanTwo && <MenuSeparator />}
					{handleDelete && (
						<DeletePopover
							count={1}
							side="right"
							align="end"
							onConfirm={handleDelete}
							open={popoverOpen}
							onOpenChange={handlePopoverOpenChange}
							trigger={
								<DestructiveMenuItem onClick={handleDeleteClick}>
									<Trash2 size={16} />
									מחק
								</DestructiveMenuItem>
							}
						/>
					)}
				</MenuContent>
			</DropdownMenu>
		)
	)
}

const MenuContent = styled(DropdownMenuContent)`
  direction: rtl;
  min-width: 160px;
  padding: 4px;
  border-radius: 8px;
  z-index: calc(var(--z-dropdown) + 1);
  box-shadow: var(--card-shadow-hover);
`

const MenuItem = styled(DropdownMenuItem)`
  display: flex;
  align-items: center;
  gap: 8px;
  height: 32px;
  padding-inline: 12px;
  padding-block: 5px;
  border-radius: 4px;
  font-size: var(--fs-btn);
  font-weight: 400;
  line-height: 22px;
  color: var(--text-color-2);
  cursor: pointer;

  &[data-highlighted],
  &:hover {
    background: var(--secondary);
    color: var(--text-color-2);
    outline: none;
  }
`

const DestructiveMenuItem = styled(MenuItem)`
  color: var(--Components-Form-Component-labelRequiredMarkColor);

  &[data-highlighted],
  &:hover {
    background: var(--secondary);
    color: var(--Components-Form-Component-labelRequiredMarkColor);
  }
`

const MenuSeparator = styled(DropdownMenuSeparator)`
  margin-block: 4px;
  background: var(--button-hover);
`

const DefaultTrigger = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  flex-shrink: 0;
  color: var(--sea-ink-soft);
  cursor: pointer;
  outline: none;

  &:hover {
    background: var(--button-hover);
    color: var(--sea-ink);
  }
`
