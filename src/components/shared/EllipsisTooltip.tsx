import styled from "@emotion/styled"
import type { ReactNode } from "react"
import { useOverflow } from "src/hooks/useOverflow"
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
	const { ref, isOverflowing } = useOverflow<HTMLSpanElement>({
		content: tooltip,
		includeDescendants: true,
	})

	return (
		<Tooltip>
			<TooltipTrigger asChild>
				<Text ref={ref} className={className} dir={dir}>
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
  unicode-bidi: plaintext;
`
