import styled from '@emotion/styled'
import compleateInstruction from '../../assets/icons/completeInstruction.svg'
import { EmptyCardState } from './EmptyCardState'
import { ViewMoreInstructions } from './ViewMoreInstructions'

interface RecentlyCompletedProps {
  urlName: string
}

const RecentlyCompletedDesc = {
  title: 'טרם בוצעו הנחיות',
  description: 'לאחר שהנחיות יבצעו,\nההנחיות האחרונות יופיעו כאן'
}

export default function RecentlyCompleted({ urlName }: RecentlyCompletedProps) {
  const { title, description } = RecentlyCompletedDesc

  return (
    <Section>
      <SectionTitle>הנחיות שבוצעו לאחרונה</SectionTitle>
      <Card>
        <EmptyCardState
          imgSrc={compleateInstruction}
          title={title}
          description={description}
        />
      </Card>
      <ViewMoreInstructions urlName={urlName} />
    </Section>
  )
}

const Section = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const SectionTitle = styled.h2`
  margin: 0;
  font-size: 24px;
  font-weight: 400;
  color: var(--sea-ink);
  text-align: start;
`

const Card = styled.div`
  flex: 1;
  background: var(--background);
  border: 1px solid var(--border);
  border-radius: 8px;
  min-height: 320px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 1px 2px oklch(0 0 0 / 0.03), 0 1px 6px -1px oklch(0 0 0 / 0.02), 0 2px 4px oklch(0 0 0 / 0.02);
`