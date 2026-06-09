import styled from "@emotion/styled"
import { createFileRoute } from "@tanstack/react-router"
import { PermissionsContent } from "src/components/settings/PermissionsContent"
import { SectionTitle } from "src/components/settings/SectionTitle"
import { SETTINGS_TABS, SettingTabPath } from "src/utils/settings-utils"

export const Route = createFileRoute(
	"/workspace/$urlName/settings/permissions",
)({ component: SettingsPermissions })

const activeTabLabel = SETTINGS_TABS[SettingTabPath.PERMISSIONS]

function SettingsPermissions() {
	return (
		<PermissionsRoot>
			<SectionTitle title={activeTabLabel} />

			<PermissionsScrollArea>
				<PermissionsContent />
			</PermissionsScrollArea>
		</PermissionsRoot>
	)
}

const PermissionsRoot = styled.div`
  flex: 1;
  min-height: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 4px;
`

const PermissionsScrollArea = styled.div`
  flex: 1;
  min-height: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`
