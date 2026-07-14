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

interface SettingToggleRowProps {
	label?: string
	tooltip?: string
	icon?: ReactNode
	checked?: boolean
	onCheckedChange?: (checked: boolean) => void
}

export function SettingToggleRow({
	label,
	tooltip,
	icon,
	checked,
	onCheckedChange,
}: SettingToggleRowProps) {
	return (
		<Row>
			<StyledSwitch
				size="sm"
				checked={checked}
				onCheckedChange={onCheckedChange}
			/>
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
  box-shadow: var(--card-shadow-hover);
  border-radius: 8px;
  padding: 12px;
  font-size: var(--fs-sm);

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
