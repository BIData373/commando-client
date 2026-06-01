import styled from "@emotion/styled"
import {
	createFileRoute,
	Outlet,
	useNavigate,
	useRouterState,
} from "@tanstack/react-router"
import { SETTINGS_TABS, SettingTabPath } from "src/utils/settings-utils"
import { Tabs, TabsList, TabsTrigger } from "../../../components/ui/tabs"

export const Route = createFileRoute("/workspace/$urlName/settings")({
	component: SettingsLayout,
	staticData: {
		header: {
			title: "הגדרות סביבת המפקד",
			user: true,
			navigation: true,
			workspace: true,
		},
	},
})

const SETTINGS_ROUTES: Record<SettingTabPath, string> = {
	[SettingTabPath.GENERAL]: "/workspace/$urlName/settings/general",
	[SettingTabPath.ASSIGNEES]: "/workspace/$urlName/settings/assignees",
	[SettingTabPath.PERMISSIONS]: "/workspace/$urlName/settings/permissions",
} as const

function SettingsLayout() {
	const navigate = useNavigate()
	const { location } = useRouterState()
	const { urlName } = Route.useParams()

	const activeTab =
		Object.values(SettingTabPath).find((t) => location.pathname.endsWith(t)) ??
		SettingTabPath.GENERAL

	function handleTabChange(value: string) {
		const path = SETTINGS_ROUTES[value as SettingTabPath]
		navigate({ to: path, params: { urlName } })
	}

	return (
		<SettingsRoot>
			<Tabs value={activeTab} onValueChange={handleTabChange}>
				<FullWidthTabsList variant="line">
					{Object.values(SettingTabPath).map((value) => (
						<StyledTabsTrigger key={value} value={value}>
							{SETTINGS_TABS[value]}
						</StyledTabsTrigger>
					))}
				</FullWidthTabsList>
			</Tabs>
			<ContentWrapper>
				<OutletContainer>
					<Outlet />
				</OutletContainer>
			</ContentWrapper>
		</SettingsRoot>
	)
}

const SettingsRoot = styled.div`
  padding-block: 32px;
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
  gap: 32px;
`

const FullWidthTabsList = styled(TabsList)`
  width: 380px;
  border-bottom: 1px solid var(--line);
  align-self: flex-end;
  direction: rtl;
`

const StyledTabsTrigger = styled(TabsTrigger)`
  color: var(--text-color-2);
  font-weight: 400;
  font-size: 16px;
  cursor: pointer;

  &[data-state="active"] {
    color: #1677ff;
  }
  
  &[data-state="active"]::after {
    background-color: #1677ff;
  }
`

const ContentWrapper = styled.div`
  flex: 1;
  min-height: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 24px;
`

const OutletContainer = styled.div`
  flex: 1;
  min-height: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`
