import styled from "@emotion/styled"
import { RowMenu } from "./RowMenu"
import type { RowMenuActions } from "./RowMenuItems"

interface RowContextMenuProps {
	position: { x: number; y: number } | null
	onOpenChange: (open: boolean) => void
	actions: RowMenuActions
}

export function RowContextMenu({
	position,
	onOpenChange,
	actions,
}: RowContextMenuProps) {
	if (!position) return null

	return (
		<RowMenu
			trigger={<AnchorPoint style={{ left: position.x, top: position.y }} />}
			open
			onOpenChange={onOpenChange}
			actions={actions}
		/>
	)
}

const AnchorPoint = styled.span`
  position: fixed;
  width: 0;
  height: 0;
  pointer-events: none;
`
