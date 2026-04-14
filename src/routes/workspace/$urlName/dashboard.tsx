import styled from '@emotion/styled'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { ChevronDown, Plus, Users } from 'lucide-react'
import DateRangePicker from '../../../components/Dashboard/DateRangePicker'
import FocusedInstructions from '../../../components/Dashboard/FocusedInstructions'
import RecentlyCompleted from '../../../components/Dashboard/RecentlyCompleted'
import StatusCard from '../../../components/Dashboard/StatusCard'
import SystemDistribution from '../../../components/Dashboard/SystemDistribution'



const TitleSection = () => {
  const { urlName } = Route.useParams()
  const navigate = useNavigate()

  function handleSetAssignees() {
    navigate({ to: '/workspace/$urlName/settings/assignees', params: { urlName } })
  }

  function handleCreateInstruction() {
    navigate({ to: '/workspace/$urlName/tasks/new', params: { urlName }, search: { view: 'TABLE' } })
  }

  return (
    <TitleSectionContainer>
      <TitleGroup>
        <PageTitle>מסך המפקד</PageTitle>
        <TitleDivider />
        <WorkspaceName>לשכת מקשא&quot;פ</WorkspaceName>
      </TitleGroup>
      <ButtonGroup>
        <AssigneesButton onClick={handleSetAssignees}>
          הגדרת מקבלי הנחיות
          <Users size={18} />
        </AssigneesButton>
        <CreateButton onClick={handleCreateInstruction}>
          <ChevronDown size={18} />
          צור הנחייה
          <Plus size={18} />
        </CreateButton>
      </ButtonGroup>
    </TitleSectionContainer>
  )
}

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
        <DateRangePicker />

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

const TitleSectionContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const TitleGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

const WorkspaceName = styled.span`
  font-size: 24px;
  font-weight: 400;
  color: var(--sea-ink-soft);
  white-space: nowrap;
`

const TitleDivider = styled.div`
  width: 1px;
  height: 38px;
  background: var(--line);
  flex-shrink: 0;
`

const PageTitle = styled.h1`
  margin: 0;
  font-size: 38px;
  font-weight: 500;
  color: var(--foreground);
  white-space: nowrap;
`

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`

const CreateButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 40px;
  padding: 0 15px;
  border: none;
  border-radius: 8px;
  background: linear-gradient(165deg, var(--purple-start) 0%, var(--purple-end) 100%);
  color: var(--primary-foreground);
  font-size: 16px;
  font-weight: 400;
  cursor: pointer;
  white-space: nowrap;
  transition: opacity 0.15s;

  &:hover {
    opacity: 0.9;
  }
`

const AssigneesButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 40px;
  padding: 0 15px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--background);
  color: var(--foreground);
  font-size: 16px;
  font-weight: 400;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.15s;

  &:hover {
    background: var(--chip-bg);
  }
`

const ContentArea = styled.div`
  display: flex;
  flex-direction: column;
  padding-block-end: 32px;
  color: var(--sea-ink-soft);
  gap: 72px;
  
  margin-top: 32px;
`


const SectionsRow = styled.div`
  display: flex;
  gap: 72px;
  align-items: flex-start;
`
