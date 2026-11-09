import styled from "@emotion/styled"
import { CircleHelp } from "lucide-react"
import type { ReactNode } from "react"
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "src/components/ui/tooltip"
import { DisabledReasonSwitch } from "./DisabledReasonSwitch"

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
			<DisabledReasonSwitch
				size="sm"
				checked={checked}
				disabled={disabled}
				disabledReason={disabledTooltip}
				onCheckedChange={onCheckedChange}
			/>
			<Info>
				<Icon $disabled={!!disabled}>{icon}</Icon>
				<Label $disabled={!!disabled}>{label}</Label>
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

const Label = styled.span<{ $disabled: boolean }>`
  font-size: var(--fs-base);
  font-weight: 400;
  color: ${({ $disabled }) =>
		$disabled ? "var(--Text-color-text-placeholder)" : "var(--text-color-2)"};
  white-space: nowrap;
`

const Icon = styled.span<{ $disabled: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  color: ${({ $disabled }) =>
		$disabled ? "var(--Text-color-text-placeholder)" : "var(--sea-ink-soft)"};
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
