import styled from "@emotion/styled"
import { useVirtualizer } from "@tanstack/react-virtual"
import { type RefObject, useLayoutEffect, useRef, useState } from "react"
import type { TaskRowDto } from "src/api/model"
import MobileTaskCard from "./MobileTaskCard"

const ESTIMATED_CARD_HEIGHT = 160
const CARD_GAP = 12
const VIRTUAL_OVERSCAN = 6

interface MobileTaskListProps {
	tasks: TaskRowDto[]
	searchQuery: string
	scrollContainerRef: RefObject<HTMLDivElement | null>
	onOpenTask: (task: TaskRowDto) => void
}

export default function MobileTaskList({
	tasks,
	searchQuery,
	scrollContainerRef,
	onOpenTask,
}: MobileTaskListProps) {
	const listRef = useRef<HTMLDivElement>(null)
	const [scrollMargin, setScrollMargin] = useState(0)

	// The toolbar above the list scrolls with it and changes height (search focus, active filters)
	useLayoutEffect(() => {
		setScrollMargin(listRef.current?.offsetTop ?? 0)
	})

	const virtualizer = useVirtualizer({
		count: tasks.length,
		getScrollElement: () => scrollContainerRef.current,
		estimateSize: () => ESTIMATED_CARD_HEIGHT,
		overscan: VIRTUAL_OVERSCAN,
		scrollMargin,
		getItemKey: (index) => tasks[index].rowKey,
	})

	const virtualItems = virtualizer.getVirtualItems()
	const firstItem = virtualItems.at(0)
	const lastItem = virtualItems.at(-1)
	const paddingTop = firstItem ? firstItem.start - scrollMargin : 0
	const paddingBottom = lastItem
		? virtualizer.getTotalSize() - (lastItem.end - scrollMargin)
		: 0

	return (
		<List ref={listRef}>
			<Spacer $height={paddingTop} />
			{virtualItems.map(({ key, index }) => {
				const task = tasks[index]

				return (
					<CardSlot
						key={key}
						data-index={index}
						ref={virtualizer.measureElement}
					>
						<MobileTaskCard
							task={task}
							searchQuery={searchQuery}
							onClick={() => onOpenTask(task)}
						/>
					</CardSlot>
				)
			})}
			<Spacer $height={paddingBottom} />
		</List>
	)
}

const List = styled.div`
	display: flex;
	flex-direction: column;
	flex-shrink: 0;
`

const Spacer = styled.div<{ $height: number }>`
	height: ${({ $height }) => $height}px;
	flex-shrink: 0;
`

const CardSlot = styled.div`
	padding-bottom: ${CARD_GAP}px;
`
