import styled from "@emotion/styled"
import { createFileRoute } from "@tanstack/react-router"
import { SectionTitle } from "src/components/settings/SectionTitle"
import { SettingsForm } from "src/components/settings/SettingsForm"
import { SETTINGS_TABS, SettingTabPath } from "src/utils/settings-utils"

export const Route = createFileRoute("/workspace/$urlName/settings/general")({
	component: SettingsGeneral,
})

const activeTabLabel = SETTINGS_TABS[SettingTabPath.GENERAL]

function SettingsGeneral() {
	return (
		<GeneralRootPage>
			<SectionTitle title={activeTabLabel} />

			<GeneralScrollArea>
				<SettingsForm />
			</GeneralScrollArea>
		</GeneralRootPage>
	)
}

const GeneralRootPage = styled.div`
  flex: 1;
  min-height: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 24px;
`

const GeneralScrollArea = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
  direction: ltr;
  padding: 0 12px;
`
