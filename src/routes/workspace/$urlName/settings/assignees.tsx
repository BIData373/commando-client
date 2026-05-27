import styled from "@emotion/styled";
import { createFileRoute } from "@tanstack/react-router";
import { AssigneesContent } from "src/components/settings/AssigneesContent";
import { SectionTitle } from "src/components/settings/SectionTitle";
import { WorkspaceProvider } from "src/providers/WorkspaceProvider";
import { SETTINGS_TABS, SettingTabPath } from "src/utils/settingsUtils";

export const Route = createFileRoute("/workspace/$urlName/settings/assignees")({
	component: SettingsAssignees,
});

const activeTab = SETTINGS_TABS[SettingTabPath.ASSIGNEES];

function SettingsAssignees() {
	return (
		<AssigneesRoot>
			<SectionTitle title={`ניהול אחראים - ${activeTab}`} />

			<CardScrollArea>
				<WorkspaceProvider>
					<AssigneesContent />
				</WorkspaceProvider>
			</CardScrollArea>
		</AssigneesRoot>
	);
}

const AssigneesRoot = styled.div`
  flex: 1;
  min-height: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const CardScrollArea = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
  direction: ltr;
`;
