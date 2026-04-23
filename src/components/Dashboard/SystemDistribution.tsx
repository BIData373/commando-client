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

interface SystemDistributionProps {
  onSetAssignees?: () => void
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

export default function SystemDistribution({ onSetAssignees }: SystemDistributionProps) {
  const [activeTab, setActiveTab] = useState<DistributionTab>(DistributionTab.LOAD)

  function handleTabClick(tabId: DistributionTab) {
    setActiveTab(tabId)
  }

  const tabDescription = TabsDescription[activeTab];

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
          <EmptyCardState
            imgSrc={tabDescription.imgSrc}
            title={tabDescription.title}
            description={tabDescription.description}
            childrens={
              activeTab == DistributionTab.LOAD && (
                <Button variant="outline" size="sm" onClick={onSetAssignees}>
                  הגדרת מקבלי הנחיות
                  <Users size={16} />
                </Button>
              )
            }
          />
        </ContentPanel>
      </TabsWrapper>
    </Section>
  )
}

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 360px;
  flex-shrink: 0;
  align-self: flex-start;
`

const SectionTitle = styled.h2`
  margin: 0;
  font-size: 24px;
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

const ContentPanel = styled.div<{ $dashed?: boolean }>`
  flex: 1;
  background: var(--background);
  border: 1px solid var(--border);
  border-radius: 8px;
  border-start-start-radius: 0;
  min-height: 320px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 1;
`