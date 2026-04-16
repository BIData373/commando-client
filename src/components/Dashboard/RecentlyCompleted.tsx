import styled from '@emotion/styled'
import compleateInstruction from '../../assets/icons/completeInstruction.svg'
import { ViewMoreInstructions } from './ViewMoreInstructions'

interface RecentlyCompletedProps {
  urlName: string
}

export default function RecentlyCompleted({ urlName }: RecentlyCompletedProps) {
  return (
    <Section>
      <SectionTitle>הנחיות שבוצעו לאחרונה</SectionTitle>
      <Card>
        <EmptyState>
          <EmptyIconWrapper>
            <img src={compleateInstruction} alt='completeInstruction' />
          </EmptyIconWrapper>
          <EmptyTitle>טרם בוצעו הנחיות</EmptyTitle>
          <EmptyDescription>
            <span>לאחר שהנחיות יבצעו,</span>
            <span>ההנחיות האחרונות יופיעו כאן</span>
          </EmptyDescription>
        </EmptyState>
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

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 24px;
  max-width: 260px;
  text-align: center;
`

const EmptyIconWrapper = styled.div`
  width: 72px;
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--sea-ink-soft);
  opacity: 0.6;
  margin-bottom: 8px;
`

const EmptyTitle = styled.p`
  font-size: 15px;
  font-weight: 500;
  color: var(--sea-ink);
  margin: 0;
`

const EmptyDescription = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 14px;
  color: var(--sea-ink-soft);
  line-height: 22px;
`