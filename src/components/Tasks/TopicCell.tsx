import styled from "@emotion/styled"
import { useLayoutEffect, useRef, useState } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"

interface TopicCellProps {
	tags: string[]
}

const GAP = 4

export function TopicCell({ tags }: TopicCellProps) {
	const containerRef = useRef<HTMLDivElement>(null)
	const measureRef = useRef<HTMLDivElement>(null)
	const [visibleCount, setVisibleCount] = useState(tags.length)

	const calculateVisibleTags = () => {
		const container = containerRef.current
		const measure = measureRef.current

		if (!container || !measure || tags.length === 0) {
			setVisibleCount(tags.length)
			return
		}

		const budget = container.offsetWidth
		const children = Array.from(measure.children) as HTMLElement[]
		const overflowWidth = children[children.length - 1].offsetWidth

		let used = 0
		let fits = 0
		let i = 0
		let canFit = true

		while (i < tags.length && canFit) {
			const tagWidth = children[i].offsetWidth
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
	}

	useLayoutEffect(() => {
		const container = containerRef.current
		if (!container) return

		const observer = new ResizeObserver(() => {
			calculateVisibleTags()
		})

		observer.observe(container)

		return () => observer.disconnect()
	}, [])

	useLayoutEffect(() => {
		calculateVisibleTags()
	}, [tags])

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

			{hiddenTags.length > 0 && (
				<Popover>
					<PopoverTrigger asChild>
						<OverflowTag>{hiddenTags.length}+</OverflowTag>
					</PopoverTrigger>
					<StyledPopoverContent side="top" sideOffset={6}>
						<OverflowList>
							{hiddenTags.map((tag) => (
								<Tag key={tag}>{tag}</Tag>
							))}
						</OverflowList>
					</StyledPopoverContent>
				</Popover>
			)}
		</CellRoot>
	)
}

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
  font-size: 12px;
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
  font-size: 12px;
  line-height: 20px;
  background: rgba(0, 0, 0, 0.02);
  color: rgba(0, 0, 0, 0.88);
  white-space: nowrap;
  flex-shrink: 0;
  border: none;
  cursor: pointer;
`

const StyledPopoverContent = styled(PopoverContent)`
  width: auto;
  min-width: unset;
  padding: 8px;
`

const OverflowList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${GAP}px;
`
