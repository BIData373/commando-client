import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import styled from "@emotion/styled"
import { Eye, EyeOff, GripVertical } from "lucide-react"
import type { TaskColumnMeta } from "src/utils/task-table-utils"

interface SortableColumnItemProps {
	column: TaskColumnMeta
	isHidden: boolean
	isLocked: boolean
	onToggle: () => void
}

function SortableColumnItem({
	column,
	isHidden,
	isLocked,
	onToggle,
}: SortableColumnItemProps) {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({ id: column.id })

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	}

	return (
		<ItemRow ref={setNodeRef} style={style} $isDragging={isDragging}>
			<ItemLabel>{column.label}</ItemLabel>
			<ItemActions>
				<IconButton
					onClick={isLocked ? undefined : onToggle}
					type="button"
					disabled={isLocked}
				>
					{isHidden ? <EyeoffIcon size={16} /> : <Eye size={16} />}
				</IconButton>
				<DragHandle data-drag-handle {...attributes} {...listeners}>
					<GripVertical size={16} />
				</DragHandle>
			</ItemActions>
		</ItemRow>
	)
}

export { SortableColumnItem }

// ─── Styled ──────────────────────────────────────────────────────────────────

const DragHandle = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  padding: 0;
  cursor: grab;
  color: rgba(0, 0, 0, 0.45);
  opacity: 0;
  transition: opacity 0.15s;

  &:active {
    cursor: grabbing;
  }
`

const ItemRow = styled.div<{ $isDragging: boolean }>`
direction: ltr;
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: space-between;
  height: 32px;
  padding-inline: 8px;
  padding-block: 5px;
  border-radius: 4px;
  cursor: default;
  background: ${({ $isDragging }) => ($isDragging ? "rgba(0, 0, 0, 0.04)" : "transparent")};
  box-shadow: ${({ $isDragging }) =>
		$isDragging
			? "0px 6px 16px rgba(0, 0, 0, 0.08), 0px 3px 6px rgba(0, 0, 0, 0.12), 0px 9px 28px rgba(0, 0, 0, 0.05)"
			: "none"};

  &:hover {
    background: rgba(0, 0, 0, 0.04);

    [data-drag-handle] {
      opacity: 1;
    }
  }
`

const ItemLabel = styled.span`
  direction: rtl;
  flex: 1;
  font-size: var(--fs-btn);
  font-weight: 400;
  line-height: 22px;
  color: rgba(0, 0, 0, 0.88);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const ItemActions = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
`

const IconButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  color: rgba(0, 0, 0, 0.45);

  &:hover:not(:disabled) {
    color: rgba(0, 0, 0, 0.88);
  }

  &:disabled {
    cursor: default;
    color: rgba(0, 0, 0, 0.25);
  }
`

const EyeoffIcon = styled(EyeOff)`
  color: rgba(0, 0, 0, 0.25);
`
