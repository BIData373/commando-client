import styled from "@emotion/styled"
import { Mail, Pencil } from "lucide-react"
import {
	getGetAssigneeQueryKey,
	getListAssigneesQueryKey,
} from "src/api/assignee/assignee"
import type { AssigneesDto, UpdateWorkspaceDto } from "src/api/model"
import { useUpdateWorkspace } from "src/api/workspace/workspace"
import { updateEnvironmentMessage } from "src/functions/toast-messages"
import { useWorkspace } from "src/providers/WorkspaceProvider"
import { invalidateQueries } from "src/query-client"
import chatIcon from "../../assets/icons/chat.svg"
import { SettingToggleRow } from "../shared/SettingToggleRow"

interface AssigneesSettingsSectionsProps {
	assignees: AssigneesDto[]
}

export function AssigneesSettingsSections({
	assignees,
}: AssigneesSettingsSectionsProps) {
	const {
		workspace: {
			id: workspaceId,
			assigneeStatusEditable,
			chatNotification,
			mailNotification,
		},
		setWorkspace,
	} = useWorkspace()

	const { mutateAsync: updateSettings } = useUpdateWorkspace({
		mutation: {
			meta: {
				toast: { success: updateEnvironmentMessage, error: true },
			},
			onSuccess(data, { data: { assigneeStatusEditable } }) {
				setWorkspace(data)

				if (assigneeStatusEditable) {
					invalidateQueries([
						getListAssigneesQueryKey({ workspaceId }),
						...assignees.map(({ id }) => getGetAssigneeQueryKey({ id })),
					])
				}
			},
		},
	})

	function updateWorkspaceSetting(data: UpdateWorkspaceDto) {
		updateSettings({ pathParams: { id: workspaceId }, data })
	}

	function handleWorkspaceStatusEditableChange(checked: boolean) {
		updateWorkspaceSetting({ assigneeStatusEditable: checked })
	}

	function handleChatNotificationsChange(checked: boolean) {
		updateWorkspaceSetting({ chatNotification: checked })
	}

	function handleMailNotificationsChange(checked: boolean) {
		updateWorkspaceSetting({ mailNotification: checked })
	}

	return (
		<SettingsSectionWrapper>
			<SettingsSection>
				<SettingToggleRow
					label="הרשאות עריכת סטטוס מבוזרות"
					tooltip="מאפשר לאחראים שקיבלו את ההנחיה לעדכן את הסטטוס שלה. אם האפשרות כבויה – עדכון הסטטוס יתאפשר רק למנהלי הסביבה."
					icon={<Pencil size={18} />}
					checked={assigneeStatusEditable}
					onCheckedChange={handleWorkspaceStatusEditableChange}
				/>
			</SettingsSection>
			<SettingsSection>
				<SettingToggleRow
					label="שלח התראות בצ'אט למכותבים"
					tooltip="שליחת התראות בצ'אט למכותבים בעת קבלת הנחיות"
					icon={<img src={chatIcon} alt="" width={18} height={18} />}
					checked={chatNotification}
					onCheckedChange={handleChatNotificationsChange}
				/>

				<SettingToggleRow
					label="שלח התראות במייל למכותבים"
					tooltip="שליחת התראות במייל למכותבים בעת קבלת הנחיות"
					icon={<Mail size={18} />}
					checked={mailNotification}
					onCheckedChange={handleMailNotificationsChange}
				/>
			</SettingsSection>
		</SettingsSectionWrapper>
	)
}

const SettingsSectionWrapper = styled.div`
	display: flex;
	align-items: flex-start;
	gap: 16px;
`

const SettingsSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 360px;
  gap: 8px;
  padding: 8px;
  background: var(--background);
  border-radius: 8px;
`
