import styled from '@emotion/styled'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { DatePicker } from '#/components/Dashboard/DatePicker'
import FocusedInstructions from '../../../components/Dashboard/FocusedInstructions'
import RecentlyCompleted from '../../../components/Dashboard/RecentlyCompleted'
import StatusCard from '../../../components/Dashboard/StatusCard'
import SystemDistribution from '../../../components/Dashboard/SystemDistribution'
import { TitleSection } from '#/components/Dashboard/TileSection'




export const Route = createFileRoute('/workspace/$urlName/dashboard')({
  component: Dashboard,
  staticData: {
    header: {
      title: <TitleSection />,
      user: true,
      navigation: true,
      workspace: true,
    },
  },
})


function Dashboard() {
  const { urlName } = Route.useParams()
  const navigate = useNavigate()


  function handleSetAssignees() {
    navigate({ to: '/workspace/$urlName/settings/assignees', params: { urlName } })
  }

  return (
    <PageWrapper>

      <ContentArea>
        <DatePicker />

        <SectionsRow>
          <FocusedInstructions urlName={urlName} />
          <StatusCard done={80} inProgress={20} pending={200} />
        </SectionsRow>

        <SectionsRow>
          <RecentlyCompleted urlName={urlName} />
          <SystemDistribution onSetAssignees={handleSetAssignees} />
        </SectionsRow>
      </ContentArea>
    </PageWrapper>
  )
}

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100%;
`

const ContentArea = styled.div`
  display: flex;
  flex-direction: column;
  padding-block-end: 32px;
  color: var(--sea-ink-soft);
  margin-top: 16px;

  & > *:nth-of-type(1) {
    margin-block-start: 14px;
  }

  & > *:nth-of-type(2) {
    margin-block-start: 46px;
  }
`


const SectionsRow = styled.div`
  display: flex;
  gap: 54px;
  align-items: flex-start;
`