import styled from '@emotion/styled'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import type { DateRange } from 'react-day-picker'
import { DatePicker } from '#/components/Dashboard/DatePicker/DatePicker'
import { DATE_TYPES } from '#/components/Dashboard/DatePicker/DatePickerHeader'
import { TitleSection } from '#/components/Dashboard/TileSection'
import FocusedInstructions from '../../../components/Dashboard/FocusedInstructions'
import RecentlyCompleted from '../../../components/Dashboard/RecentlyCompleted'
import StatusCard from '../../../components/Dashboard/StatusCard'
import SystemDistribution from '../../../components/Dashboard/SystemDistribution'


const distributions = [
  { name: 'ddsadsdasdasdasd', count: 7 },
  { name: 'מג"ד 272', count: 7 },
  { name: 'מג"ד 272', count: 8 },
  { name: 'מג"ד 272', count: 12 },
  { name: 'מג"ד 273', count: 13 },
  { name: 'מג"ד 274', count: 14 },
  { name: 'מג"ד 275', count: 15 },
  { name: 'מג"ד 276', count: 16 },
  { name: 'מג"ד 277', count: 17 },
  { name: 'סא"ל דגן', count: 23 },
]

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

  const [dataType, setDataType] = useState<string>(DATE_TYPES[0])

  function handleDatePickerConfirm(range: DateRange | undefined) {
    console.log(`${dataType} ${range?.from}`)
  }

  function handleSetAssignees() {
    navigate({ to: '/workspace/$urlName/settings/assignees', params: { urlName } })
  }

  return (
    <PageWrapper>

      <ContentArea>
        <DatePicker
          dateType={dataType}
          onDateTypeChange={setDataType}
          setRange={handleDatePickerConfirm}
        />

        <GridLayout>
          <FocusedInstructions urlName={urlName} />
          <StatusCard done={80} inProgress={20} pending={200} />
          <RecentlyCompleted urlName={urlName} />
          <SystemDistribution
            onSetAssignees={handleSetAssignees}
            distribution={distributions}
          />
        </GridLayout>
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
    margin-block-start: 72px;
  }
`


const GridLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 450px;
  gap: 72px;

  @media (max-width: 1100px) {
    grid-template-columns: 1fr 1fr;
    gap: 48px 24px;
  }
`

