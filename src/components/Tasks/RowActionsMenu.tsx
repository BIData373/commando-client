import styled from "@emotion/styled"
import { Archive, CheckCircle2, Pencil, Trash2 } from "lucide-react"
import type { ReactNode } from "react"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import { DeletePopover } from "./DeletePopover"

interface RowActionsMenuProps {
	trigger: ReactNode
	onEdit: () => void
	onEnterSelect: () => void
	onArchive: () => void
	onDelete: () => void
}

export function RowActionsMenu({
	trigger,
	onEdit,
	onEnterSelect,
	onArchive,
	onDelete,
}: RowActionsMenuProps) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
			<MenuContent align="start" sideOffset={4}>
				<MenuItem onSelect={onEdit}>
					<Pencil size={16} />
					עריכה
				</MenuItem>
				<MenuItem onSelect={onEnterSelect}>
					<CheckCircle2 size={16} />
					סמן
				</MenuItem>
				<MenuSeparator />
				<MenuItem onSelect={onArchive}>
					<Archive size={16} />
					העבר לארכיון
				</MenuItem>
				<DeletePopover
					count={1}
					side="bottom"
					align="start"
					onConfirm={onDelete}
					trigger={
						<DestructiveMenuItem onSelect={(e) => e.preventDefault()}>
							<Trash2 size={16} />
							מחק
						</DestructiveMenuItem>
					}
				/>
			</MenuContent>
		</DropdownMenu>
	)
}

const MenuContent = styled(DropdownMenuContent)`
  direction: rtl;
  min-width: 160px;
  padding: 4px;
  border-radius: 8px;
  box-shadow:
    0px 6px 16px rgba(0, 0, 0, 0.08),
    0px 3px 6px rgba(0, 0, 0, 0.12),
    0px 9px 28px rgba(0, 0, 0, 0.05);
`

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
  color: rgba(0, 0, 0, 0.88);
  cursor: pointer;

  &[data-highlighted],
  &:hover {
    background: var(--link-bg-hover);
    color: rgba(0, 0, 0, 0.88);
    outline: none;
  }
`

const DestructiveMenuItem = styled(MenuItem)`
  color: #ff4d4f;

  &[data-highlighted],
  &:hover {
    background: #fff1f0;
    color: #ff4d4f;
  }
`

const MenuSeparator = styled(DropdownMenuSeparator)`
  margin-block: 4px;
  background: rgba(0, 0, 0, 0.06);
`
