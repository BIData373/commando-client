import styled from "@emotion/styled";
import { Archive, CheckCircle2, Pencil, Trash2 } from "lucide-react";
import { type ReactNode, useState } from "react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { DeletePopover } from "./DeletePopover";

interface RowActionsMenuProps {
	trigger: ReactNode;
	onEdit?: () => void;
	onEnterSelect?: () => void;
	onArchive: () => void;
	onDelete?: () => void;
}

export function RowActionsMenu({
	trigger,
	onEdit,
	onEnterSelect,
	onArchive,
	onDelete,
}: RowActionsMenuProps) {
	const [dropdownOpen, setDropdownOpen] = useState(false);
	const [popoverOpen, setPopoverOpen] = useState(false);

	const hasMoreThanTwo =
		[onEdit, onEnterSelect, onDelete].filter(Boolean).length >= 2;

	function handleDropdownOpenChange(open: boolean) {
		if (!open && popoverOpen) return;
		setDropdownOpen(open);
	}

	function handleDeleteClick() {
		setPopoverOpen(true);
	}

	function handlePopoverOpenChange(open: boolean) {
		setPopoverOpen(open);
		if (!open) setDropdownOpen(false);
	}

	return (
		<DropdownMenu
			open={dropdownOpen || popoverOpen}
			onOpenChange={handleDropdownOpenChange}
		>
			<DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
			<MenuContent align="start" sideOffset={4}>
				{onEdit && (
					<MenuItem onSelect={onEdit}>
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
				<MenuItem onSelect={onArchive}>
					<Archive size={16} />
					העבר לארכיון
				</MenuItem>
				{onDelete && (
					<DeletePopover
						count={1}
						side="right"
						align="end"
						onConfirm={onDelete}
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
	);
}

const MenuContent = styled(DropdownMenuContent)`
  direction: rtl;
  min-width: 160px;
  padding: 4px;
  border-radius: 8px;
  z-index: calc(var(--z-dropdown) + 1);
  box-shadow: var(--card-shadow-hover);
`;

const MenuItem = styled(DropdownMenuItem)`
  display: flex;
  align-items: center;
  gap: 8px;
  height: 32px;
  padding-inline: 12px;
  padding-block: 5px;
  border-radius: 4px;
  font-size: 14px;
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
`;

const DestructiveMenuItem = styled(MenuItem)`
  color: var(--Components-Form-Component-labelRequiredMarkColor);

  &[data-highlighted],
  &:hover {
    background: var(--secondary);
    color: var(--Components-Form-Component-labelRequiredMarkColor);
  }
`;

const MenuSeparator = styled(DropdownMenuSeparator)`
  margin-block: 4px;
  background: var(--button-hover);
`;
