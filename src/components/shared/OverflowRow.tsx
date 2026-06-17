import styled from "@emotion/styled"
import {
	cloneElement,
	type ReactElement,
	type Ref,
	useLayoutEffect,
	useRef,
	useState,
} from "react"

interface OverflowRowProps {
	items: ReactElement[]
	renderOverflow: (remaining: number) => ReactElement
	gap?: number
}

export function OverflowRow({
	items,
	renderOverflow,
	gap = 8,
}: OverflowRowProps) {
	const [visibleCount, setVisibleCount] = useState(items.length)
	const [prevCount, setPrevCount] = useState(items.length)

	const containerRef = useRef<HTMLDivElement>(null)
	const itemRefs = useRef<(HTMLElement | null)[]>([])
	const overflowEl = useRef<HTMLElement | null>(null)

	// Derived state: reset so all items render for measurement when count changes
	if (prevCount !== items.length) {
		setPrevCount(items.length)
		setVisibleCount(items.length)
	}

	useLayoutEffect(() => {
		const container = containerRef.current
		if (!container) return

		function recalculate() {
			if (!container) {
				return
			}

			const containerWidth = container.offsetWidth
			const overflowW = overflowEl.current
				? overflowEl.current.offsetWidth + gap
				: 0

			let used = 0
			let count = 0

			const currentItems = (
				itemRefs.current.slice(0, items.length) as (HTMLElement | null)[]
			).entries()

			for (const [i, el] of currentItems) {
				if (!el) {
					break
				}

				const currentWidth = el.offsetWidth + (i > 0 ? gap : 0)
				const currentTotalWidth =
					used + currentWidth + (i < items.length - 1 ? overflowW : 0)

				if (currentTotalWidth > containerWidth) {
					break
				}

				used += currentWidth
				count++
			}

			setVisibleCount(count)
		}

		recalculate()

		const ro = new ResizeObserver(recalculate)
		ro.observe(container)

		return () => ro.disconnect()
	}, [items.length, gap])

	const remaining = items.length - visibleCount

	return (
		<Row ref={containerRef} $gap={gap}>
			{items.slice(0, visibleCount).map((item, i) =>
				cloneElement(item as ReactElement<{ ref?: Ref<HTMLElement> }>, {
					ref: (el: HTMLElement | null) => {
						itemRefs.current[i] = el
					},
				}),
			)}

			<OverflowIndicator
				ref={(el: HTMLElement | null) => {
					overflowEl.current = el
				}}
				$hidden={remaining === 0}
				aria-hidden={remaining === 0 || undefined}
			>
				{renderOverflow(remaining === 0 ? items.length : remaining)}
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
