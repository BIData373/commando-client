import styled from '@emotion/styled'
import { Users } from 'lucide-react'
import { useState } from 'react'
import addAssignee from '../../assets/icons/addPerson.svg'
import subject from '../../assets/icons/subjects.svg'
import { Button } from '../ui/button'
import { EmptyCardState } from './EmptyCardState'

enum DistributionTab {
  LOAD = 'load',
  ATTENTION = 'attention'
}

interface DistributionTabConfig {
  id: DistributionTab
  label: string
}

interface DistributionItem {
  name: string
  count: number
}

interface SystemDistributionProps {
  onSetAssignees?: () => void
  distribution?: DistributionItem[]
}


const TABS: DistributionTabConfig[] = [
  { id: DistributionTab.LOAD, label: 'חלוקת עומסים' },
  { id: DistributionTab.ATTENTION, label: 'חלוקת קשב' },
]

const TabsDescription = {
  [DistributionTab.LOAD]: {
    imgSrc: addAssignee,
    title: 'טרם הוגדרו אחראים',
    description: 'לא נמצאו אחראים כדי להציג נתונים'
  },
  [DistributionTab.ATTENTION]: {
    imgSrc: subject,
    title: 'טרם הוגדרו נושאים',
    description: 'ביצירת הנחיות ניתן לחלק אותם לנושאים,\nקטגוריות או מאמצים',
  }
}

export default function SystemDistribution({ onSetAssignees, distribution }: SystemDistributionProps) {
  const [activeTab, setActiveTab] = useState<DistributionTab>(DistributionTab.LOAD)

  function handleTabClick(tabId: DistributionTab) {
    setActiveTab(tabId)
  }

  const tabDescription = TabsDescription[activeTab]
  const hasData = activeTab === DistributionTab.LOAD && distribution && distribution.length > 0
  const maxCount = hasData ? Math.max(...distribution.map((d) => d.count), 1) : 1

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
        <ContentPanel $hasData={hasData}>
          {hasData ? (
            <ChartWrapper>
              <ChartHeader>
                <HeaderLabel>אחראי</HeaderLabel>
                <HeaderLabel>כמות הנחיות</HeaderLabel>
              </ChartHeader>
              <BarList>
                {distribution.map((item) => (
                  <BarRow key={item.name}>
                    <AssigneeName>{item.name}</AssigneeName>
                    <BarTrack>
                      <BarFill $pct={(item.count / maxCount) * 100} />
                    </BarTrack>
                    <CountLabel>{item.count}</CountLabel>
                  </BarRow>
                ))}
              </BarList>
            </ChartWrapper>
          ) : (
            <EmptyCardState
              imgSrc={tabDescription.imgSrc}
              title={tabDescription.title}
              description={tabDescription.description}
            >
              {activeTab === DistributionTab.LOAD && (
                <Button variant="outline" size="sm" onClick={onSetAssignees}>
                  הגדרת מקבלי הנחיות
                  <Users size={16} />
                </Button>
              )}
            </EmptyCardState>
          )}
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
  justify-self: end;

  @media (max-width: 1100px) {
    grid-column: 2;
    grid-row: 2;
    width: 100%;
    flex-shrink: 1;
}
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
  font-size: 15px;
  font-weight: 400;
  color: var(--foreground);
`

const ContentPanel = styled.div<{ $hasData?: boolean }>`
  flex: 1;
  background: var(--background);
  border: 1px solid var(--border);
  border-radius: 8px;
  border-start-start-radius: 0;
  min-height: 390px;
  max-height: 390px;
  display: flex;
  align-items: ${({ $hasData }) => ($hasData ? 'flex-start' : 'center')};
  justify-content: center;
  position: relative;
  z-index: 1;
`

const ChartWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px 20px 20px;
  width: 100%;
`

const ChartHeader = styled.div`
  display: flex;
  justify-content: space-between;
`

const HeaderLabel = styled.span`
  font-size: 16px;
  color: var(--sea-ink-soft);
`

const BarList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 324px;
  overflow-y: auto;
`

const BarRow = styled.div`
  display: flex;
  align-items: center;
  gap: 18px;
`

const AssigneeName = styled.span`
  font-size: 16px;
  color: var(--sea-ink);
  white-space: nowrap;
  flex-shrink: 0;
`

const CountLabel = styled.span`
  font-size: 16px;
  color: var(--sea-ink);
  width: 24px;
  text-align: end;
  flex-shrink: 0;
`

const BarTrack = styled.div`
  flex: 1;
  height: 8px;
  background: var(--line);
  border-radius: 4px;
  overflow: hidden;
`

const BarFill = styled.div<{ $pct: number }>`
  height: 100%;
  width: ${({ $pct }) => $pct}%;
  background: #bae0ff;
  border-radius: 4px;
`