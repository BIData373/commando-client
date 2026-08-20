import styled from "@emotion/styled"
import {
	Archive,
	ArchiveX,
	CheckCircle2,
	MessageCircle,
	Pencil,
	Trash2,
} from "lucide-react"
import { type ReactNode, useMemo } from "react"
import { DropdownMenuContent, DropdownMenuItem } from "../ui/dropdown-menu"
import { DeletePopover } from "./DeletePopover"

interface MenuItemDef {
	key: string
	node: ReactNode
}

interface RowMenuItemsProps {
	onEdit?: () => void
	onAddComment?: () => void
	onEnterSelect?: () => void
	onDelete?: () => void
	onArchive?(): void
	onUnarchive?(): void
	popoverOpen: boolean
	onPopoverOpenChange: (open: boolean) => void
}

export function RowMenuItems({
	onEdit,
	onAddComment,
	onEnterSelect,
	onDelete,
	popoverOpen,
	onPopoverOpenChange,
	onArchive,
	onUnarchive,
}: RowMenuItemsProps) {
	const groups = useMemo(() => {
		const group1: MenuItemDef[] = []
		const group2: MenuItemDef[] = []
		const group3: MenuItemDef[] = []

		if (onAddComment) {
			group1.push({
				key: "comment",
				node: (
					<MenuItem onSelect={onAddComment}>
						<MessageCircle size={16} />
						הוספת תגובה
					</MenuItem>
				),
			})
		}

		if (onEdit) {
			group2.push({
				key: "edit",
				node: (
					<MenuItem onSelect={onEdit}>
						<Pencil size={16} />
						עריכה
					</MenuItem>
				),
			})
		}
		if (onArchive) {
			group2.push({
				key: "archive",
				node: (
					<MenuItem onSelect={onArchive}>
						<Archive size={16} />
						העבר לארכיון
					</MenuItem>
				),
			})
		}
		if (onUnarchive) {
			group2.push({
				key: "unarchive",
				node: (
					<MenuItem onSelect={onUnarchive}>
						<ArchiveX size={16} />
						הסר מארכיון
					</MenuItem>
				),
			})
		}
		if (onEnterSelect) {
			group2.push({
				key: "select",
				node: (
					<MenuItem onSelect={onEnterSelect}>
						<CheckCircle2 size={16} />
						סמן
					</MenuItem>
				),
			})
		}

		if (onDelete) {
			group3.push({
				key: "delete",
				node: (
					<DeletePopover
						count={1}
						side="right"
						align="end"
						onConfirm={onDelete}
						open={popoverOpen}
						onOpenChange={onPopoverOpenChange}
						trigger={
							<DestructiveMenuItem onClick={() => onPopoverOpenChange(true)}>
								<Trash2 size={16} />
								מחק
							</DestructiveMenuItem>
						}
					/>
				),
			})
		}

		return [group1, group2, group3].filter((g) => g.length > 0)
	}, [
		onAddComment,
		onEdit,
		onArchive,
		onUnarchive,
		onEnterSelect,
		onDelete,
		popoverOpen,
		onPopoverOpenChange,
	])

	return (
		<MenuContent align="start" sideOffset={4}>
			{groups.map((group) => (
				<Group key={group[0].key}>
					{group.map((item) => (
						<div key={item.key}>{item.node}</div>
					))}
				</Group>
			))}
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

const Group = styled.div`
  & + & {
    border-block-start: 1px solid var(--button-hover);
    margin-block-start: 4px;
    padding-block-start: 4px;
  }
`
