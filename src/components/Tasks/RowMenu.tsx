import { type ReactNode, useState } from "react"
import { DropdownMenu, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { type RowMenuActions, RowMenuItems } from "./RowMenuItems"

interface RowMenuProps {
	trigger: ReactNode
	open: boolean
	onOpenChange: (open: boolean) => void
	actions?: RowMenuActions
}

export function RowMenu({
	trigger,
	open,
	onOpenChange,
	actions = {},
}: RowMenuProps) {
	const [popoverOpen, setPopoverOpen] = useState(false)

	const itemCount = Object.values(actions).filter(Boolean).length

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
					actions={actions}
					popoverOpen={popoverOpen}
					onPopoverOpenChange={handlePopoverOpenChange}
				/>
			</DropdownMenu>
		)
	)
}
