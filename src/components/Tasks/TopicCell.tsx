import styled from "@emotion/styled"
import {
	createContext,
	memo,
	useCallback,
	useContext,
	useLayoutEffect,
	useRef,
	useState,
} from "react"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "../ui/hover-card"

// Tag pixel width depends only on its text (shared font/padding across every
// row), and the column budget is identical for every row (table-layout is
// fixed) — so both are safe to cache across every TopicCell within the same
// table instead of remeasuring per row. This is what turns an O(rows × tags)
// forced-layout cost during a big scroll jump into roughly O(unique tags),
// since most rows end up reusing tag widths another row already measured.
export interface TagMeasurementCache {
	widths: Map<string, number>
	columnWidth: number | null
}

function createTagMeasurementCache(): TagMeasurementCache {
	return { widths: new Map(), columnWidth: null }
}

// Optional: wrap a table's rows in this once to let every TopicCell inside
// it share one cache. Without it, TopicCell still works correctly — it just
// falls back to a private, per-instance cache with no cross-row sharing.
// Either way, nothing module-level: no leaking across unrelated tables.
const TagMeasurementCacheContext = createContext<TagMeasurementCache | null>(
	null,
)

export function TagMeasurementCacheProvider({
	children,
}: {
	children: React.ReactNode
}) {
	const cacheRef = useRef<TagMeasurementCache>(undefined)
	cacheRef.current ??= createTagMeasurementCache()

	return (
		<TagMeasurementCacheContext.Provider value={cacheRef.current}>
			{children}
		</TagMeasurementCacheContext.Provider>
	)
}

const OVERFLOW_TAG_CACHE_KEY = "__overflow__"

interface TopicCellProps {
	tags: string[]
}

const GAP = 4

export const TopicCell = memo(function TopicCell({ tags }: TopicCellProps) {
	const contextCache = useContext(TagMeasurementCacheContext)
	const ownCacheRef = useRef<TagMeasurementCache>(undefined)
	ownCacheRef.current ??= createTagMeasurementCache()
	const cache = contextCache ?? ownCacheRef.current

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

		if (cache.columnWidth === null) {
			cache.columnWidth = container.offsetWidth
		}
		const budget = cache.columnWidth
		const children = Array.from(measure.children) as HTMLElement[]

		function widthOf(key: string, el: HTMLElement) {
			const cached = cache.widths.get(key)
			if (cached !== undefined) return cached
			const width = el.offsetWidth
			cache.widths.set(key, width)
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
	}, [tags.length, cache])

	useLayoutEffect(() => {
		const container = containerRef.current
		if (!container) return

		const observer = new ResizeObserver(() => {
			cache.columnWidth = null
			calculateVisibleTags()
		})

		observer.observe(container)

		return () => observer.disconnect()
	}, [calculateVisibleTags, cache])

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
