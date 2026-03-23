import styled from '@emotion/styled'
import { Outlet, createFileRoute, useNavigate, useRouterState } from '@tanstack/react-router'
import { Tabs, TabsList, TabsTrigger } from '../../../components/ui/tabs'

export const Route = createFileRoute('/workspace/$urlName/settings')({
  component: SettingsLayout,
  staticData: {
    header: {
      title: 'הגדרות לשכה',
      user: true,
      navigation: true,
      workspace: true,
    },
  },
})

type SettingsTabPath = 'general' | 'assignees' | 'permissions'

const SETTINGS_TABS: { label: string; path: SettingsTabPath }[] = [
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

  const activeTabLabel = SETTINGS_TABS.find((t) => t.path === activeTab)?.label ?? ''

  function handleTabChange(value: string) {
    const path = SETTINGS_ROUTES[value as SettingsTabPath]
    navigate({ to: path, params: { urlName } })
  }

  return (
    <SettingsRoot>
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <FullWidthTabsList variant="line">
          {SETTINGS_TABS.map((tab) => (
            <TabsTrigger key={tab.path} value={tab.path}>
              {tab.label}
            </TabsTrigger>
          ))}
        </FullWidthTabsList>
      </Tabs>
      <ContentWrapper>
        <SectionTitle>{activeTabLabel}</SectionTitle>
        <Outlet />
      </ContentWrapper>
    </SettingsRoot>
  )
}

const SettingsRoot = styled.div`
  padding-block: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`

const FullWidthTabsList = styled(TabsList)`
  width: 100%;
  border-bottom: 1px solid var(--line);
  width: 400px;
  align-self: flex-end;
  direction: rtl;
`

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`

const SectionTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: var(--sea-ink);
  margin: 0;
`
