import styled from "@emotion/styled"
import { type ReactNode, useLayoutEffect, useRef, useState } from "react"
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip"

interface EllipsisTooltipProps {
	children: ReactNode
	tooltip: string
	className?: string
	dir?: "auto" | "ltr" | "rtl"
	side?: "top" | "right" | "bottom" | "left"
}

export default function EllipsisTooltip({
	children,
	tooltip,
	className,
	dir,
	side,
}: EllipsisTooltipProps) {
	const textRef = useRef<HTMLSpanElement>(null)
	const [isOverflowing, setIsOverflowing] = useState(false)

	useLayoutEffect(() => {
		const element = textRef.current

		if (!element) {
			return
		}

		function updateOverflow() {
			if (!element) {
				return
			}

			const descendants = Array.from(element.querySelectorAll<HTMLElement>("*"))
			const hasOverflow = [element, ...descendants].some(
				(node) => node.scrollWidth > node.clientWidth,
			)

			setIsOverflowing(hasOverflow)
		}

		updateOverflow()

		const observer = new ResizeObserver(updateOverflow)
		observer.observe(element)
		element.querySelectorAll<HTMLElement>("*").forEach((descendant) => {
			observer.observe(descendant)
		})

		return () => observer.disconnect()
	}, [tooltip])

	return (
		<Tooltip>
			<TooltipTrigger asChild>
				<Text ref={textRef} className={className} dir={dir}>
					{children}
				</Text>
			</TooltipTrigger>

			{isOverflowing && <TooltipContent side={side}>{tooltip}</TooltipContent>}
		</Tooltip>
	)
}

const Text = styled.span`
  display: block;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`
