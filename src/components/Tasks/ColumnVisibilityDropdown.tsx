import { restrictToParentElement, restrictToVerticalAxis } from '@dnd-kit/modifiers';
import {
  closestCenter,
  DndContext,
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
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import styled from '@emotion/styled'
import { Columns3 } from 'lucide-react'
import { useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { SortableColumnItem } from './SortableColumnItem'
import type { Task } from '#/data/Tasks'

export type TaskColumn = keyof Task

export interface ColumnConfig {
  id: TaskColumn
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
  columnOrder: TaskColumn[]
  hiddenColumns: Set<TaskColumn>
  onColumnOrderChange: (order: TaskColumn[]) => void
  onToggleColumn: (columnId: TaskColumn) => void
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
      const oldIndex = columnOrder.indexOf(active.id as TaskColumn)
      const newIndex = columnOrder.indexOf(over.id as TaskColumn)
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
          modifiers={[restrictToParentElement, restrictToVerticalAxis]}
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
