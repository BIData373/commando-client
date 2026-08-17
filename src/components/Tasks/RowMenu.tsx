import { type ReactNode, useState } from "react"
import { DropdownMenu, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { RowMenuItems } from "./RowMenuItems"

interface RowMenuProps {
	trigger: ReactNode
	open: boolean
	onOpenChange: (open: boolean) => void
	onEdit?: () => void
	onEnterSelect?: () => void
	onDelete?: () => void
	onArchive?(): void
	onUnarchive?(): void
}

export function RowMenu({
	trigger,
	open,
	onOpenChange,
	onEdit,
	onEnterSelect,
	onDelete,
	onArchive,
	onUnarchive,
}: RowMenuProps) {
	const [popoverOpen, setPopoverOpen] = useState(false)

	const itemCount = [
		onArchive,
		onUnarchive,
		onEdit,
		onEnterSelect,
		onDelete,
	].filter(Boolean).length

	function handleOpenChange(nextOpen: boolean) {
		if (!nextOpen && popoverOpen) return
		onOpenChange(nextOpen)
	}

	function handlePopoverOpenChange(nextOpen: boolean) {
		setPopoverOpen(nextOpen)
		if (!nextOpen) onOpenChange(false)
	}

	return (
		itemCount > 0 && (
			<DropdownMenu open={open || popoverOpen} onOpenChange={handleOpenChange}>
				<DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
				<RowMenuItems
					onEdit={onEdit}
					onEnterSelect={onEnterSelect}
					onDelete={onDelete}
					onArchive={onArchive}
					onUnarchive={onUnarchive}
					popoverOpen={popoverOpen}
					onPopoverOpenChange={handlePopoverOpenChange}
				/>
			</DropdownMenu>
		)
	)
}
