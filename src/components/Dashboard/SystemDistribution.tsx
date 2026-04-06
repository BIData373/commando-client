import { useState } from 'react'
import styled from '@emotion/styled'
import { Users } from 'lucide-react'
import { Button } from '../ui/button'

type DistributionTab = 'load' | 'attention'

interface DistributionTabConfig {
  id: DistributionTab
  label: string
}

interface SystemDistributionProps {
  onSetAssignees?: () => void
}

const TABS: DistributionTabConfig[] = [
  { id: 'attention', label: 'חלוקת קשב' },
  { id: 'load', label: 'חלוקת עומסים' },
]

export default function SystemDistribution({ onSetAssignees }: SystemDistributionProps) {
  const [activeTab, setActiveTab] = useState<DistributionTab>('load')

  function handleTabClick(tabId: DistributionTab) {
    setActiveTab(tabId)
  }

  return (
    <Section>
      <SectionTitle>התפלגות במערכת</SectionTitle>
      <TabsWrapper>
        <TabsHeader>
          {TABS.map((tab) => (
            <TabItem
              key={tab.id}
              $active={tab.id === activeTab}
              onClick={() => handleTabClick(tab.id)}
            >
              <TabTitle $active={tab.id === activeTab}>{tab.label}</TabTitle>
            </TabItem>
          ))}
        </TabsHeader>
        <ContentPanel>
          <EmptyState>
            <EmptyIconWrapper>
              <Users size={48} />
            </EmptyIconWrapper>
            <EmptyTitle>טרם הוגדרו אחראים</EmptyTitle>
            <EmptyDescription>לא נמצאו אחראים כדי להציג נתונים</EmptyDescription>
            <Button variant="outline" size="sm" onClick={onSetAssignees}>
              הגדרת מקבלי הנחיות
              <Users size={16} />
            </Button>
          </EmptyState>
        </ContentPanel>
      </TabsWrapper>
    </Section>
  )
}

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 450px;
  flex-shrink: 0;
  align-self: stretch;
`

const SectionTitle = styled.h2`
  margin: 0;
  font-size: 30px;
  font-weight: 400;
  color: var(--sea-ink);
  text-align: start;
`

const TabsWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`

const TabsHeader = styled.div`
  display: flex;
  gap: 2px;
  position: relative;
  z-index: 2;
`

const TabItem = styled.button<{ $active: boolean }>`
  height: 40px;
  padding: 8px 16px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  border: 1px solid var(--border);
  border-bottom-color: ${({ $active }) => $active ? 'var(--background)' : 'var(--border)'};
  border-radius: 6px 6px 0 0;
  background: ${({ $active }) => $active ? 'var(--background)' : 'transparent'};
  opacity: ${({ $active }) => $active ? 1 : 0.5};
  cursor: pointer;
  margin-bottom: -1px;
  transition: opacity 0.15s;
`

const TabTitle = styled.span<{ $active: boolean }>`
  font-size: 20px;
  font-weight: 400;
  color: var(--foreground);
`

const ContentPanel = styled.div`
  flex: 1;
  background: var(--background);
  border: 1px solid var(--border);
  border-radius: 8px;
  border-start-start-radius: 0;
  min-height: 420px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 1;
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
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--sea-ink-soft);
  opacity: 0.6;
  margin-bottom: 8px;
`

const EmptyTitle = styled.p`
  font-size: 20px;
  font-weight: 500;
  color: var(--sea-ink);
  margin: 0;
`

const EmptyDescription = styled.p`
  font-size: 14px;
  color: var(--sea-ink-soft);
  margin: 0 0 12px;
`
