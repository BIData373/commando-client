import { useState } from 'react'
import styled from '@emotion/styled'
import { Columns3, Eye, EyeOff, GripVertical } from 'lucide-react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'

export interface ColumnConfig {
  id: string
  label: string
}

export const CONFIGURABLE_COLUMNS: ColumnConfig[] = [
  { id: 'title', label: 'שם הנחיה' },
  { id: 'status', label: 'סטטוס' },
  { id: 'responsible', label: 'אחראי' },
  { id: 'deadlineType', label: 'תג"ב' },
  { id: 'discussionName', label: 'מקור' },
  { id: 'tags', label: 'נושא' },
  { id: 'notes', label: 'הערות' },
  { id: 'updatedAt', label: 'עודכן ב' },
  { id: 'createdAt', label: 'תאריך יצירה' },
]

export const DEFAULT_COLUMN_ORDER = CONFIGURABLE_COLUMNS.map((c) => c.id)

interface ColumnVisibilityDropdownProps {
  columnOrder: string[]
  hiddenColumns: Set<string>
  onColumnOrderChange: (order: string[]) => void
  onToggleColumn: (columnId: string) => void
}

function ColumnVisibilityDropdown({
  columnOrder,
  hiddenColumns,
  onColumnOrderChange,
  onToggleColumn,
}: ColumnVisibilityDropdownProps) {
  const [open, setOpen] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (over && active.id !== over.id) {
      const oldIndex = columnOrder.indexOf(String(active.id))
      const newIndex = columnOrder.indexOf(String(over.id))
      onColumnOrderChange(arrayMove(columnOrder, oldIndex, newIndex))
    }
  }

  const orderedColumns = columnOrder.map(
    (id) => CONFIGURABLE_COLUMNS.find((c) => c.id === id)!,
  )

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <TriggerButton>
          <Columns3 size={16} />
          תצוגת עמודות
        </TriggerButton>
      </PopoverTrigger>
      <StyledPopoverContent align="end" sideOffset={4}>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={columnOrder}
            strategy={verticalListSortingStrategy}
          >
            {orderedColumns.map((col) => (
              <SortableColumnItem
                key={col.id}
                column={col}
                isHidden={hiddenColumns.has(col.id)}
                isLocked={col.id === 'title'}
                onToggle={() => onToggleColumn(col.id)}
              />
            ))}
          </SortableContext>
        </DndContext>
      </StyledPopoverContent>
    </Popover>
  )
}

export { ColumnVisibilityDropdown }

// ─── Sortable Item ───────────────────────────────────────────────────────────

interface SortableColumnItemProps {
  column: ColumnConfig
  isHidden: boolean
  isLocked: boolean
  onToggle: () => void
}

function SortableColumnItem({ column, isHidden, isLocked, onToggle }: SortableColumnItemProps) {
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
        <IconButton onClick={isLocked ? undefined : onToggle} type="button" disabled={isLocked}>
          {isHidden ? <EyeoffIcon size={16}/> : <Eye size={16} />}
        </IconButton>
        <DragHandle data-drag-handle {...attributes} {...listeners}>
          <GripVertical size={16} />
        </DragHandle>
      </ItemActions>
    </ItemRow>
  )
}

// ─── Styled ──────────────────────────────────────────────────────────────────

const TriggerButton = styled.button`
  direction: rtl;
  display: flex;
  align-items: center;
  gap: 8px;
  padding-inline: 15px;
  height: 40px;
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  font-size: 16px;
  color: rgba(0, 0, 0, 0.88);
  cursor: pointer;
  background: white;
  white-space: nowrap;
  box-shadow: 0px 2px 0px 0px rgba(0, 0, 0, 0.02);

  &:hover {
    background: var(--link-bg-hover);
  }
`

const StyledPopoverContent = styled(PopoverContent)`
  direction: rtl;
  width: 186px;
  padding: 4px;
  border-radius: 8px;
  gap: 0;
  box-shadow:
    0px 6px 16px rgba(0, 0, 0, 0.08),
    0px 3px 6px rgba(0, 0, 0, 0.12),
    0px 9px 28px rgba(0, 0, 0, 0.05);
`

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
  background: ${({ $isDragging }) => ($isDragging ? 'rgba(0, 0, 0, 0.04)' : 'transparent')};
  box-shadow: ${({ $isDragging }) =>
    $isDragging
      ? '0px 6px 16px rgba(0, 0, 0, 0.08), 0px 3px 6px rgba(0, 0, 0, 0.12), 0px 9px 28px rgba(0, 0, 0, 0.05)'
      : 'none'};

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
  font-size: 14px;
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
