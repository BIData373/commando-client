import styled from "@emotion/styled"
import { HelpCircle } from "lucide-react"
import { Tooltip as TooltipPrimitive } from "radix-ui"
import { Tooltip, TooltipProvider, TooltipTrigger } from "../ui/tooltip"
import FlagIcon from "./FlagIcon"

// ─── Types ──────────────────────────────────────────────────────────────────

interface ImportantFlagTooltipProps {
	side: "top" | "left" | "right" | "bottom"
}

// ─── Component ──────────────────────────────────────────────────────────────

function ImportantFlagTooltip({ side }: ImportantFlagTooltipProps) {
	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>
					<IconButton type="button">
						<HelpCircle size={16} />
					</IconButton>
				</TooltipTrigger>
				<TooltipPrimitive.Portal>
					<TooltipContent side={side} sideOffset={8}>
						הנחיה במיקוד תופיע עם סימון של דגל
						<FlagIcon />
					</TooltipContent>
				</TooltipPrimitive.Portal>
			</Tooltip>
		</TooltipProvider>
	)
}

export default ImportantFlagTooltip

// ─── Styles ─────────────────────────────────────────────────────────────────

const IconButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  cursor: pointer;
  color: rgba(0, 0, 0, 0.45);
  padding: 0;
`

const TooltipContent = styled(TooltipPrimitive.Content)`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 12px;
  background: white;
  border-radius: 8px;
  font-size: var(--fs-btn);
  line-height: 22px;
  color: rgba(0, 0, 0, 0.88);
  white-space: nowrap;
  box-shadow:
    0px 6px 16px rgba(0, 0, 0, 0.08),
    0px 3px 6px -4px rgba(0, 0, 0, 0.12),
    0px 9px 28px 8px rgba(0, 0, 0, 0.05);
  z-index: 10;
`
