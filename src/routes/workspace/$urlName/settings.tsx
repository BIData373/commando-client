import styled from '@emotion/styled'
import { createFileRoute, Outlet, useNavigate, useRouterState } from '@tanstack/react-router'
import { Tabs, TabsList, TabsTrigger } from '../../../components/ui/tabs'


export const Route = createFileRoute('/workspace/$urlName/settings')({
  component: SettingsLayout,
  staticData: {
    header: {
      title: 'הגדרות סביבת המפקד',
      user: true,
      navigation: true,
      workspace: true,
    },
  },
})

export type SettingsTabPath = 'general' | 'assignees' | 'permissions'

export const SETTINGS_TABS: { label: string; path: SettingsTabPath }[] = [
  { label: 'פרטי הסביבה', path: 'general' },
  { label: 'מקבלי הנחיות', path: 'assignees' },
  { label: 'הרשאות ניהול וצפיה', path: 'permissions' },
]

const SETTINGS_ROUTES = {
  general: '/workspace/$urlName/settings/general',
  assignees: '/workspace/$urlName/settings/assignees',
  permissions: '/workspace/$urlName/settings/permissions',
} as const

function SettingsLayout() {
  const navigate = useNavigate()
  const { location } = useRouterState()
  const { urlName } = Route.useParams()

  const activeTab = (SETTINGS_TABS.find((t) =>
    location.pathname.endsWith(t.path)
  )?.path ?? 'general') as SettingsTabPath

  function handleTabChange(value: string) {
    const path = SETTINGS_ROUTES[value as SettingsTabPath]
    navigate({ to: path, params: { urlName } })
  }

  return (
    <SettingsRoot>
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <FullWidthTabsList variant="line">
          {SETTINGS_TABS.map((tab) => (
            <StyledTabsTrigger key={tab.path} value={tab.path}>
              {tab.label}
            </StyledTabsTrigger>
          ))}
        </FullWidthTabsList>
      </Tabs>
      <ContentWrapper>
        <OutletContainer>
          <Outlet />
        </OutletContainer>
      </ContentWrapper>
    </SettingsRoot >
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

  &[data-state="active"] {
    color: #1677ff;
    font-weight: 500;
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