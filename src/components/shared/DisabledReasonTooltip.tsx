import styled from "@emotion/styled"
import { Tooltip as TooltipPrimitive } from "radix-ui"
import type { ReactNode } from "react"
import { Tooltip, TooltipProvider, TooltipTrigger } from "../ui/tooltip"

interface DisabledReasonTooltipProps {
	reason?: string
	children: ReactNode
}

export function DisabledReasonTooltip({
	reason,
	children,
}: DisabledReasonTooltipProps) {
	if (!reason) {
		return children
	}

	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>
					<Trigger>{children}</Trigger>
				</TooltipTrigger>
				<TooltipPrimitive.Portal>
					<Content side="left" sideOffset={8}>
						{reason}
						<Arrow width={16} height={8} />
					</Content>
				</TooltipPrimitive.Portal>
			</Tooltip>
		</TooltipProvider>
	)
}

const Trigger = styled.span`
  display: inline-flex;
  align-items: center;
`

const Content = styled(TooltipPrimitive.Content)`
  max-width: 260px;
  padding: 6px 8px;
  background: var(--text-color-2);
  border-radius: 6px;
  font-size: var(--fs-btn);
  line-height: 22px;
  color: var(--background);
  text-align: start;
  direction: rtl;
  z-index: var(--z-dropdown);
`

const Arrow = styled(TooltipPrimitive.Arrow)`
  fill: var(--text-color-2);
`
