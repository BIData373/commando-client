import styled from "@emotion/styled"
import { CircleHelp } from "lucide-react"
import type { ReactNode } from "react"
import { Switch } from "src/components/ui/switch"
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "src/components/ui/tooltip"
import { DisabledReasonTooltip } from "./DisabledReasonTooltip"

interface SettingToggleRowProps {
	label?: string
	tooltip?: ReactNode
	disabledTooltip?: string
	icon?: ReactNode
	checked?: boolean
	disabled?: boolean
	onCheckedChange?: (checked: boolean) => void
}

export function SettingToggleRow({
	label,
	tooltip,
	disabledTooltip,
	icon,
	checked,
	disabled,
	onCheckedChange,
}: SettingToggleRowProps) {
	return (
		<Row>
			<DisabledReasonTooltip reason={disabled ? disabledTooltip : undefined}>
				<StyledSwitch
					size="sm"
					checked={checked}
					disabled={disabled}
					onCheckedChange={onCheckedChange}
				/>
			</DisabledReasonTooltip>
			<Info>
				<Icon>{icon}</Icon>
				<Label>{label}</Label>
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>
							<HelpButton>
								<CircleHelp size={16} />
							</HelpButton>
						</TooltipTrigger>
						<StyledTooltipContent side="left">{tooltip}</StyledTooltipContent>
					</Tooltip>
				</TooltipProvider>
			</Info>
		</Row>
	)
}

const StyledSwitch = styled(Switch)`
  cursor: pointer;

`
const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`

const Info = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`

const Label = styled.span`
  font-size: var(--fs-base);
  font-weight: 400;
  color: var(--text-color-2);
  white-space: nowrap;
`

const Icon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  color: var(--sea-ink-soft);
`

const HelpButton = styled.button`
  display: flex;
  align-items: center;
  background: none;
  border: none;
  padding: 0;
  color: var(--Text-color-text-placeholder);
  cursor: pointer;
`

const StyledTooltipContent = styled(TooltipContent)`
  background: var(--background);
  color: var(--text-color-2);
  border-radius: 8px;
  padding: 12px;
  max-width: 320px;
  font-size: var(--fs-btn);
  line-height: 22px;
  box-shadow:
    0px 6px 16px rgba(0, 0, 0, 0.08),
    0px 3px 6px -4px rgba(0, 0, 0, 0.12),
    0px 9px 28px 8px rgba(0, 0, 0, 0.05);

  svg {
    opacity: 0;
  }

  &::after {
    content: '';
    position: absolute;
    top: 50%;
    inset-inline-start: -6px;
    transform: translateY(-50%);
    border: 6px solid transparent;
    border-inline-end-color: var(--background);
    border-inline-start: none;
  }
`
