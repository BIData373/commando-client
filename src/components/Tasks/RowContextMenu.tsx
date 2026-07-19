import styled from "@emotion/styled"
import type { TaskRowDto } from "src/api/model"
import { RowMenu } from "./RowMenu"

interface RowContextMenuProps<TTask extends TaskRowDto> {
	task: TTask | null
	position: { x: number; y: number } | null
	onOpenChange: (open: boolean) => void
	onEdit?: (taskId: number) => void
	onEnterSelect?: (rowKey: string) => void
	onDelete?: (taskId: number) => void
}

export function RowContextMenu<TTask extends TaskRowDto>({
	task,
	position,
	onOpenChange,
	onEdit,
	onEnterSelect,
	onDelete,
}: RowContextMenuProps<TTask>) {
	if (!task || !position) return null

	return (
		<RowMenu
			trigger={<AnchorPoint style={{ left: position.x, top: position.y }} />}
			open
			onOpenChange={onOpenChange}
			onEdit={onEdit && (() => onEdit(task.id))}
			onEnterSelect={onEnterSelect && (() => onEnterSelect(task.rowKey))}
			onDelete={onDelete && (() => onDelete(task.id))}
		/>
	)
}

const AnchorPoint = styled.span`
  position: fixed;
  width: 0;
  height: 0;
  pointer-events: none;
`
