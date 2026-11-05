import styled from "@emotion/styled"
import { Pencil } from "lucide-react"
import { WORKSPACE_STATUS_EDITABLE_DISABLED } from "src/functions/status-editable-messages"
import { SettingToggleRow } from "../shared/SettingToggleRow"

interface AssigneeStatusEditableToggleProps {
	checked: boolean
	disabled: boolean
	onCheckedChange(checked: boolean): void
}

export function AssigneeStatusEditableToggle({
	checked,
	disabled,
	onCheckedChange,
}: AssigneeStatusEditableToggleProps) {
	return (
		<StatusEditableGroup>
			<ToggleRowWrapper>
				<SettingToggleRow
					label="אפשר למכותבים לעדכן סטטוס"
					tooltip={
						<p>
							קובע אם משתמשים המכותבים לאחראי זה רשאים לעדכן סטטוס ב’איזור
							האישי’.
							<br />
							ניתן להגביל הרשאה זו לחלק מהמכותבים או לכולם.
						</p>
					}
					icon={<Pencil size={18} />}
					checked={checked}
					disabled={disabled}
					disabledTooltip={WORKSPACE_STATUS_EDITABLE_DISABLED}
					onCheckedChange={onCheckedChange}
				/>
			</ToggleRowWrapper>
			<StatusEditableDescription>
				חל על כל המכותבים, ניתן לכבות את האפשרות למכותבים מסוימים.
			</StatusEditableDescription>
		</StatusEditableGroup>
	)
}

const StatusEditableGroup = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`

const ToggleRowWrapper = styled.div`
  width: fit-content;
`

const StatusEditableDescription = styled.span`
  font-size: var(--fs-btn);
  line-height: 22px;
  color: var(--text-color-400);
`
