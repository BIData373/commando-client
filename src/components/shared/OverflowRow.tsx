import styled from "@emotion/styled"
import { type ReactElement, useLayoutEffect, useRef, useState } from "react"

interface OverflowRowProps {
	items: ReactElement[]
	renderOverflow: (
		remaining: number,
		hiddenItems: ReactElement[],
	) => ReactElement
	gap?: number
	preserveOrder?: boolean
}

interface RowLayout {
	itemCount: number
	order: number[]
	visibleCount: number
}

function identityLayout(items: ReactElement[]): RowLayout {
	return {
		itemCount: items.length,
		order: items.map((_, i) => i),
		visibleCount: items.length,
	}
}

function packByWidth(
	order: number[],
	widths: (number | undefined)[],
	containerWidth: number,
	overflowWidth: number,
	gap: number,
): { order: number[]; visibleCount: number } {
	// Running total width (incl. gaps) after including each rank, in order
	const cumulativeWidths = order.reduce<number[]>((totals, itemIndex, rank) => {
		const width = widths[itemIndex]
		const previousTotal = totals[rank - 1] ?? 0
		const gapWidth = rank > 0 ? gap : 0

		totals.push(
			width === undefined ? Infinity : previousTotal + width + gapWidth,
		)

		return totals
	}, [])

	const overflowIndex = cumulativeWidths.findIndex((total, rank) => {
		const isLast = rank === cumulativeWidths.length - 1
		return total + (isLast ? 0 : overflowWidth) > containerWidth
	})

	return {
		order,
		visibleCount:
			overflowIndex === -1 ? cumulativeWidths.length : overflowIndex,
	}
}

export function OverflowRow({
	items,
	renderOverflow,
	gap = 8,
	preserveOrder = false,
}: OverflowRowProps) {
	const [measured, setMeasured] = useState<RowLayout | null>(null)

	const layout =
		measured?.itemCount === items.length ? measured : identityLayout(items)

	const containerRef = useRef<HTMLDivElement>(null)
	const itemRefs = useRef<(HTMLElement | null)[]>([])
	const overflowEl = useRef<HTMLElement | null>(null)

	useLayoutEffect(() => {
		const container = containerRef.current
		if (!container) return

		function recalculate() {
			if (!container) {
				return
			}

			const containerWidth = container.offsetWidth
			const overflowWidth = overflowEl.current
				? overflowEl.current.offsetWidth + gap
				: 0

			const widths = itemRefs.current
				.slice(0, items.length)
				.map((el) => el?.offsetWidth)

			const order = preserveOrder
				? widths.map((_, i) => i)
				: widths
						.map((_, i) => i)
						.sort((a, b) => (widths[a] ?? Infinity) - (widths[b] ?? Infinity))

			setMeasured({
				itemCount: items.length,
				...packByWidth(order, widths, containerWidth, overflowWidth, gap),
			})
		}

		recalculate()

		const ro = new ResizeObserver(recalculate)
		ro.observe(container)

		return () => ro.disconnect()
	}, [items, gap, preserveOrder])

	const remaining = items.length - layout.visibleCount
	const isFullyVisible = remaining === 0
	const hiddenItems = layout.order
		.slice(layout.visibleCount)
		.sort((a, b) => a - b)
		.map((itemIndex) => items[itemIndex])

	return (
		<Row ref={containerRef} $gap={gap}>
			{layout.order.map((itemIndex, rank) => {
				const item = items[itemIndex]

				return (
					<ItemWrap
						key={item.key ?? itemIndex}
						$hidden={rank >= layout.visibleCount}
						ref={(el: HTMLSpanElement | null) => {
							itemRefs.current[itemIndex] = el
						}}
					>
						{item}
					</ItemWrap>
				)
			})}

			<OverflowIndicator
				ref={(el: HTMLElement | null) => {
					overflowEl.current = el
				}}
				$hidden={isFullyVisible}
				aria-hidden={isFullyVisible || undefined}
			>
				{renderOverflow(
					isFullyVisible ? items.length : remaining,
					isFullyVisible ? items : hiddenItems,
				)}
			</OverflowIndicator>
		</Row>
	)
}

const Row = styled.div<{ $gap: number }>`
  position: relative;
  display: flex;
  flex-wrap: nowrap;
  overflow: hidden;
  width: 100%;
  gap: ${({ $gap }) => $gap}px;
`

const ItemWrap = styled.span<{ $hidden: boolean }>`
  display: inline-flex;
  flex-shrink: 0;
  min-width: 0;

  ${({ $hidden }) =>
		$hidden &&
		`
    position: absolute;
    visibility: hidden;
    pointer-events: none;
  `}
`

const OverflowIndicator = styled.span<{ $hidden: boolean }>`
  display: inline-flex;
  flex-shrink: 0;

  ${({ $hidden }) =>
		$hidden &&
		`
    position: absolute;
    visibility: hidden;
    pointer-events: none;
  `}
`
