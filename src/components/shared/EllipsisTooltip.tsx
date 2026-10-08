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
	const { isOverflowing, handlePointerEnter } = useOverflow<HTMLSpanElement>({
		includeDescendants: true,
	})

	return (
		<Tooltip>
			<TooltipTrigger asChild>
				<Text
					className={className}
					dir={dir}
					onPointerEnter={handlePointerEnter}
				>
					{children}
				</Text>
			</TooltipTrigger>

			{isOverflowing && (
				<TooltipContent side={side}>
					<TooltipTextWrap>{tooltip}</TooltipTextWrap>
				</TooltipContent>
			)}
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

const TooltipTextWrap = styled.span`
  display: block;
  min-width: 0;
  white-space: normal;
  overflow-wrap: break-word;
`
