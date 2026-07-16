import styled from "@emotion/styled"
import { createFileRoute, Outlet } from "@tanstack/react-router"
import { AssigneesContent } from "src/components/settings/AssigneesContent"
import { SectionTitle } from "src/components/settings/SectionTitle"
import { SETTINGS_TABS, SettingTabPath } from "src/utils/settings-utils"

export const Route = createFileRoute("/workspace/$urlName/settings/assignees")({
	component: SettingsAssignees,
})

const activeTab = SETTINGS_TABS[SettingTabPath.ASSIGNEES]

function SettingsAssignees() {
	return (
		<AssigneesRoot>
			<SectionTitle title={`ניהול אחראים - ${activeTab}`} />

			<CardScrollArea>
				<AssigneesContent />
			</CardScrollArea>

			<Outlet />
		</AssigneesRoot>
	)
}

const AssigneesRoot = styled.div`
  flex: 1;
  min-height: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 32px;
`

const CardScrollArea = styled.div`
  flex: 1;
  min-height: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`
