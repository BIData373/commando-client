import styled from "@emotion/styled"
import { TEST_IDS } from "src/consts/test-ids"
import { Switch } from "../ui/switch"
import { DisabledReasonTooltip } from "./DisabledReasonTooltip"

interface DisabledReasonSwitchProps {
	checked?: boolean
	disabled?: boolean
	disabledReason?: string
	size?: "sm" | "default"
	onCheckedChange?(checked: boolean): void
	testId?: string
}

export function DisabledReasonSwitch({
	checked,
	disabled,
	disabledReason,
	size,
	onCheckedChange,
	testId = TEST_IDS.toggle.switch,
}: DisabledReasonSwitchProps) {
	return (
		<DisabledReasonTooltip reason={disabled ? disabledReason : undefined}>
			<StyledSwitch
				data-testid={testId}
				size={size}
				checked={checked}
				disabled={disabled}
				onCheckedChange={onCheckedChange}
			/>
		</DisabledReasonTooltip>
	)
}

const StyledSwitch = styled(Switch)`
  cursor: pointer;

  &[data-state="unchecked"] {
    background: var(--Text-color-text-placeholder);
  }

  &[data-disabled] {
    background: var(--input);
    opacity: 0.65;
  }
`
