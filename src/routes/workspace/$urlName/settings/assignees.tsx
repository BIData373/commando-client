import styled from "@emotion/styled"
import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router"
import { useListAssignees } from "src/api/assignee/assignee"
import { AssigneesContent } from "src/components/settings/AssigneesContent"
import { AssigneesEmptyState } from "src/components/settings/AssigneesEmptyState"
import { CircleHelpButton } from "src/components/settings/CircleHelpButton"
import { SectionTitle } from "src/components/settings/SectionTitle"
import { useWorkspace } from "src/providers/WorkspaceProvider"
import { SETTINGS_TABS, SettingTabPath } from "src/utils/settings-utils"

export const Route = createFileRoute("/workspace/$urlName/settings/assignees")({
	component: SettingsAssignees,
})

const activeTab = SETTINGS_TABS[SettingTabPath.ASSIGNEES]

function SettingsAssignees() {
	const {
		workspace: { id: workspaceId, urlName },
	} = useWorkspace()
	const { data: assignees = [] } = useListAssignees({ workspaceId })

	const isEmptyState = assignees.length === 0

	const navigate = useNavigate()

	function handleInfoModalOpen() {
		navigate({
			to: "/workspace/$urlName/settings/assignees/help",
			params: { urlName },
		})
	}

	function handleOpenCreateDialog() {
		navigate({
			to: "/workspace/$urlName/settings/assignees/new",
			params: { urlName },
		})
	}

	return (
		<AssigneesRoot>
			{!isEmptyState && (
				<TitleWrapper>
					<TitleContainer>
						<SectionTitle title={`ניהול אחראים - ${activeTab}`} />
						<CircleHelpButton onClick={handleInfoModalOpen} />
					</TitleContainer>
					<SectionDescription>
						‘אחראי’ אליו ניתן לשייך הנחיות. לכל אחראי ניתן לכתב מספר משתמשים,
						אשר יקבלו את ההנחיות לאזור האישי שלהם.
					</SectionDescription>
				</TitleWrapper>
			)}

			<CardScrollArea>
				{isEmptyState ? (
					<AssigneesEmptyState
						onOpenCreateDialog={handleOpenCreateDialog}
						onOpenInfoModal={handleInfoModalOpen}
					/>
				) : (
					<AssigneesContent onOpenCreateDialog={handleOpenCreateDialog} />
				)}
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

const TitleWrapper = styled.div`
	display: flex;
	align-items: flex-start;
	justify-content: center;
	flex-direction: column;
	gap: 0;
`

const SectionDescription = styled.p`
  direction: rtl;
  text-align: start;
  font-size: var(--fs-base);
  color: var(--text-color);
  font-weight: 400;
  line-height: 1.4;
  margin: 0 12px;
`

const CardScrollArea = styled.div`
  flex: 1;
  min-height: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`
const TitleContainer = styled.div`
  display: flex;
  align-items: center;
`
