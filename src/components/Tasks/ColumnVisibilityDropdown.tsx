import {
	closestCenter,
	DndContext,
	type DragEndEvent,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
} from "@dnd-kit/core"
import {
	restrictToParentElement,
	restrictToVerticalAxis,
} from "@dnd-kit/modifiers"
import {
	arrayMove,
	SortableContext,
	sortableKeyboardCoordinates,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import styled from "@emotion/styled"
import { Columns3 } from "lucide-react"
import { useEffect, useState } from "react"
import type { TaskRowWithWorkspaceDto } from "src/api/model"
import { useTasksFilters } from "src/providers/TasksFiltersProvider"
import {
	CONFIGURABLE_COLUMNS,
	type TaskColumnMeta,
} from "src/utils/task-table-utils"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { SortableColumnItem } from "./SortableColumnItem"

interface ColumnVisibilityDropdownProps {
	extraColumnsMeta?: TaskColumnMeta[]
}

function ColumnVisibilityDropdown({
	extraColumnsMeta,
}: ColumnVisibilityDropdownProps) {
	const { columnOrder, hiddenColumns, toggleColumn, setColumnOrder } =
		useTasksFilters()

	const [open, setOpen] = useState(false)

	// Optimistic order shown during/after drag, kept in sync with the persisted
	// `columnOrder` so the item doesn't snap back while the update round-trips.
	const [localColumnOrder, setLocalColumnOrder] =
		useState<(keyof TaskRowWithWorkspaceDto)[]>(columnOrder)

	useEffect(() => {
		setLocalColumnOrder(columnOrder)
	}, [columnOrder])

	const allColumns = extraColumnsMeta
		? [...CONFIGURABLE_COLUMNS, ...extraColumnsMeta]
		: CONFIGURABLE_COLUMNS

	const sensors = useSensors(
		useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		}),
	)

	function handleDragEnd(event: DragEndEvent) {
		const { active, over } = event
		if (over && active.id !== over.id) {
			const oldIndex = localColumnOrder.indexOf(
				active.id as keyof TaskRowWithWorkspaceDto,
			)
			const newIndex = localColumnOrder.indexOf(
				over.id as keyof TaskRowWithWorkspaceDto,
			)
			const nextOrder = arrayMove(localColumnOrder, oldIndex, newIndex)
			setColumnOrder(nextOrder)
			setLocalColumnOrder(nextOrder)
		}
	}

	const orderedColumns = localColumnOrder
		.map((id) => allColumns.find((c) => c.id === id))
		.filter((c) => c != null)

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<TriggerButton>
					<Columns3 size={18} />
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
								isLocked={col.id === "title"}
								onToggle={() => toggleColumn(col.id)}
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
  display: flex;
  padding: 0 12px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 8px;
  height: 40px;
  border-radius: 8px;
  border: 1px solid var(--card-border);
  background: var(--background);
  box-shadow: var(--shadow-button);
  cursor: pointer;
  white-space: nowrap;

  &:hover {
    background: var(--link-bg-hover);
  }
`

const StyledPopoverContent = styled(PopoverContent)`
  direction: rtl;
  width: max-content;
  min-width: 186px;
  padding: 4px;
  border-radius: 8px;
  gap: 0;
  box-shadow:
    0px 6px 16px rgba(0, 0, 0, 0.08),
    0px 3px 6px rgba(0, 0, 0, 0.12),
    0px 9px 28px rgba(0, 0, 0, 0.05);
`
