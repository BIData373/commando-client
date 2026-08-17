import styled from "@emotion/styled"
import { memo, useCallback, useLayoutEffect, useRef, useState } from "react"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "../ui/hover-card"

interface TopicCellProps {
	tags: string[]
}

const GAP = 4

const OVERFLOW_TAG_CACHE_KEY = "__overflow__"
const tagWidthCache = new Map<string, number>()
let cachedColumnWidth: number | null = null

export const TopicCell = memo(function TopicCell({ tags }: TopicCellProps) {
	const containerRef = useRef<HTMLDivElement>(null)
	const measureRef = useRef<HTMLDivElement>(null)
	const [visibleCount, setVisibleCount] = useState(tags.length)

	const calculateVisibleTags = useCallback(() => {
		const container = containerRef.current
		const measure = measureRef.current

		if (!container || !measure || tags.length === 0) {
			setVisibleCount(tags.length)
			return
		}

		if (cachedColumnWidth === null) {
			cachedColumnWidth = container.offsetWidth
		}
		const budget = cachedColumnWidth
		const children = Array.from(measure.children) as HTMLElement[]

		function widthOf(key: string, el: HTMLElement) {
			const cached = tagWidthCache.get(key)
			if (cached !== undefined) return cached
			const width = el.offsetWidth
			tagWidthCache.set(key, width)
			return width
		}

		const overflowWidth = widthOf(
			OVERFLOW_TAG_CACHE_KEY,
			children[children.length - 1],
		)

		let used = 0
		let fits = 0
		let i = 0
		let canFit = true

		while (i < tags.length && canFit) {
			const tagWidth = widthOf(tags[i], children[i])
			const addition = i === 0 ? tagWidth : GAP + tagWidth
			const isLast = i === tags.length - 1

			const budgetNeeded = isLast
				? used + addition
				: used + addition + GAP + overflowWidth

			if (budgetNeeded <= budget) {
				used += addition
				fits = i + 1
				i++
			} else {
				canFit = false
			}
		}

		setVisibleCount(fits)
	}, [tags.length])

	useLayoutEffect(() => {
		const container = containerRef.current
		if (!container) return

		const observer = new ResizeObserver(() => {
			// Column width can genuinely change (e.g. window/column resize) —
			// invalidate the shared cache so this and every other mounted row
			// picks up the fresh value on their own observer callback instead
			// of reusing a stale one.
			cachedColumnWidth = null
			calculateVisibleTags()
		})

		observer.observe(container)

		return () => observer.disconnect()
	}, [calculateVisibleTags])

	useLayoutEffect(() => {
		calculateVisibleTags()
	}, [tags, calculateVisibleTags])

	const hiddenTags = tags.slice(visibleCount)

	return (
		<CellRoot ref={containerRef}>
			<MeasureLayer ref={measureRef} aria-hidden="true">
				{tags.map((tag) => (
					<Tag key={tag}>{tag}</Tag>
				))}
				<Tag>+99</Tag>
			</MeasureLayer>

			{tags.slice(0, visibleCount).map((tag) => (
				<Tag key={tag}>{tag}</Tag>
			))}

			{/* Overflow tags shown via Radix HoverCard (replaces manual onMouseEnter/onMouseLeave + Popover) */}
			{hiddenTags.length > 0 && (
				<HoverCard openDelay={200} closeDelay={100}>
					<HoverCardTrigger asChild>
						<OverflowTag>{hiddenTags.length}+</OverflowTag>
					</HoverCardTrigger>
					<StyledHoverCardContent side="top" sideOffset={6}>
						<OverflowList>
							{hiddenTags.map((tag) => (
								<Tag key={tag}>{tag}</Tag>
							))}
						</OverflowList>
					</StyledHoverCardContent>
				</HoverCard>
			)}
		</CellRoot>
	)
})

const CellRoot = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: ${GAP}px;
  flex-wrap: nowrap;
  overflow: hidden;
  width: 100%;
`

const MeasureLayer = styled.div`
  position: absolute;
  visibility: hidden;
  pointer-events: none;
  display: flex;
  align-items: center;
  gap: ${GAP}px;
  flex-wrap: nowrap;
  white-space: nowrap;
  top: 0;
  inset-inline-start: 0;
`

const Tag = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 1px 8px;
  border-radius: 4px;
  font-size: var(--fs-sm);
  line-height: 20px;
  background: rgba(0, 0, 0, 0.02);
  color: rgba(0, 0, 0, 0.88);
  white-space: nowrap;
  flex-shrink: 0;
`

const OverflowTag = styled.button`
  display: inline-flex;
  align-items: center;
  padding: 1px 8px;
  border-radius: 4px;
  font-size: var(--fs-sm);
  line-height: 20px;
  background: rgba(0, 0, 0, 0.02);
  color: rgba(0, 0, 0, 0.88);
  white-space: nowrap;
  flex-shrink: 0;
  border: none;
  cursor: pointer;
`

const StyledHoverCardContent = styled(HoverCardContent)`
  width: auto;
  min-width: unset;
  padding: 8px;
`

const OverflowList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${GAP}px;
`
