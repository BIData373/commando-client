import styled from "@emotion/styled"
import { MoreVertical } from "lucide-react"
import { type ReactNode, useState } from "react"
import { RowMenu } from "./RowMenu"

interface RowActionsMenuProps {
	trigger?: ReactNode
	workspaceId: number
	onEdit?: () => void
	onAddComment?: () => void
	onEnterSelect?: () => void
	onDelete?: () => void
	onArchive?(): void
	onUnarchive?(): void
}

export function RowActionsMenu({
	trigger,
	onEdit,
	onAddComment,
	onEnterSelect,
	onDelete,
	onArchive,
	onUnarchive,
}: RowActionsMenuProps) {
	const [open, setOpen] = useState(false)

	return (
		<RowMenu
			trigger={
				trigger ?? (
					<DefaultTrigger>
						<MoreVertical size={16} />
					</DefaultTrigger>
				)
			}
			open={open}
			onOpenChange={setOpen}
			onEdit={onEdit}
			onAddComment={onAddComment}
			onEnterSelect={onEnterSelect}
			onDelete={onDelete}
			onArchive={onArchive}
			onUnarchive={onUnarchive}
		/>
	)
}

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

  transition-property: background, color;
  transition: 150ms ease-in-out;

  &:hover {
    background: var(--button-hover);
    color: var(--sea-ink);
  }

  &:active,
  &[data-state="open"] {
    background: var(--button-hover);
    color: var(--sea-ink);
  }
`
