import styled from "@emotion/styled"
import { Archive, ArchiveX, CheckCircle2, Pencil, Trash2 } from "lucide-react"
import {
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
} from "../ui/dropdown-menu"
import { DeletePopover } from "./DeletePopover"

interface RowMenuItemsProps {
	onEdit?: () => void
	onEnterSelect?: () => void
	onDelete?: () => void
	onArchive?(): void
	onUnarchive?(): void
	popoverOpen: boolean
	onPopoverOpenChange: (open: boolean) => void
}

export function RowMenuItems({
	onEdit,
	onEnterSelect,
	onDelete,
	popoverOpen,
	onPopoverOpenChange,
	onArchive,
	onUnarchive,
}: RowMenuItemsProps) {
	const itemCount = [
		onArchive,
		onUnarchive,
		onEdit,
		onEnterSelect,
		onDelete,
	].filter(Boolean).length
	const hasMoreThanTwo = itemCount >= 2

	function handleDeleteClick() {
		onPopoverOpenChange(true)
	}

	return (
		<MenuContent align="start" sideOffset={4}>
			{onEdit && (
				<MenuItem onSelect={onEdit}>
					<Pencil size={16} />
					עריכה
				</MenuItem>
			)}
			{onArchive && (
				<MenuItem onSelect={onArchive}>
					<Archive size={16} />
					העבר לארכיון
				</MenuItem>
			)}
			{onUnarchive && (
				<MenuItem onSelect={onUnarchive}>
					<ArchiveX size={16} />
					הסר מארכיון
				</MenuItem>
			)}
			{onEnterSelect && (
				<MenuItem onSelect={onEnterSelect}>
					<CheckCircle2 size={16} />
					סמן
				</MenuItem>
			)}
			{hasMoreThanTwo && onDelete && <MenuSeparator />}
			{onDelete && (
				<DeletePopover
					count={1}
					side="right"
					align="end"
					onConfirm={onDelete}
					open={popoverOpen}
					onOpenChange={onPopoverOpenChange}
					trigger={
						<DestructiveMenuItem onClick={handleDeleteClick}>
							<Trash2 size={16} />
							מחק
						</DestructiveMenuItem>
					}
				/>
			)}
		</MenuContent>
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
