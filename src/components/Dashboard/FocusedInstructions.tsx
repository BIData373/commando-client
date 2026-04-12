import styled from '@emotion/styled'
import { Search } from 'lucide-react'
import { useState } from 'react'
import { ViewMoreInstructions } from './ViewMoreInstructions'

type FocusedTab = 'deviation' | 'immediate' | 'important'

interface TabConfig {
  id: FocusedTab
  label: string
  count: number
  weekDelta: number
}

interface EmptyMessage {
  title: string
  description: string
}

interface IFocusedInstruction {
  urlName: string
}

const TABS: TabConfig[] = [
  { id: 'deviation', label: 'חריגות מתג"ב', count: 0, weekDelta: 0 },
  { id: 'immediate', label: 'הנחיות לביצוע מידיות', count: 0, weekDelta: 0 },
  { id: 'important', label: 'הנחיות חשובות', count: 0, weekDelta: 0 },
]

const EMPTY_MESSAGES: Record<FocusedTab, EmptyMessage> = {
  important: {
    title: 'לא נמצאו הנחיות חשובות',
    description: 'לאחר שהנחיות יוגדרו כחשובות,\nההנחיות האחרונות יופיעו כאן',
  },
  immediate: {
    title: 'לא נמצאו הנחיות לביצוע מידיות',
    description: 'הנחיות לביצוע מידיות יופיעו כאן',
  },
  deviation: {
    title: 'לא נמצאו חריגות מתג"ב',
    description: 'חריגות מתג"ב יופיעו כאן',
  },
}

export default function FocusedInstructions({ urlName }: IFocusedInstruction) {
  const [activeTab, setActiveTab] = useState<FocusedTab>('important')

  function handleTabClick(tabId: FocusedTab) {
    setActiveTab(tabId)
  }

  const emptyMsg = EMPTY_MESSAGES[activeTab]

  return (
    <Section>
      <SectionTitle>הנחיות במיקוד</SectionTitle>
      <TabsWrapper>
        <TabsHeader>
          {TABS.map((tab) => (
            <TabItem
              key={tab.id}
              $active={tab.id === activeTab}
              onClick={() => handleTabClick(tab.id)}
            >
              <TabTitle $active={tab.id === activeTab}>{tab.label}</TabTitle>
              <TabBottom>
                <TabCount $active={tab.id === activeTab}>{tab.count}</TabCount>
                <TabWeek $active={tab.id === activeTab}>
                  <span>השבוע</span>
                  <span>+{tab.weekDelta}</span>
                </TabWeek>
              </TabBottom>
            </TabItem>
          ))}
        </TabsHeader>
        <ContentPanel>
          <EmptyState>
            <EmptyIconWrapper>
              <Search size={48} />
            </EmptyIconWrapper>
            <EmptyTitle>{emptyMsg.title}</EmptyTitle>
            <EmptyDescription>
              {emptyMsg.description.split('\n').map((line, index) => (
                <span key={index}>{line}</span>
              ))}
            </EmptyDescription>
          </EmptyState>
        </ContentPanel>
      </TabsWrapper>
      <ViewMoreInstructions urlName={urlName} />
    </Section>
  )
}

const Section = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 24px;
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
  word-wrap: break-word;
  min-width: 0;
  padding: 8px 16px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
  border: 1px solid var(--border);
  border-bottom-color: ${({ $active }) => $active ? 'var(--background)' : 'var(--border)'};
  border-radius: 6px 6px 0 0;
  background: ${({ $active }) => $active ? 'var(--background)' : 'transparent'};
  opacity: ${({ $active }) => $active ? 1 : 0.5};
  cursor: pointer;
  margin-bottom: -1px;
  text-align: end;
  transition: opacity 0.15s;
`

const TabTitle = styled.span<{ $active: boolean }>`
  font-size: 24px;
  font-weight: 400;
  ${({ $active }) => $active
    ? `
      background: linear-gradient(150deg, var(--purple-start) 0%, var(--purple-end) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    `
    : `color: rgba(0, 0, 0, 0.7);`
  }
`

const TabBottom = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  width: 100%;
`

const TabCount = styled.span<{ $active: boolean }>`
  font-size: 38px;
  font-weight: 400;
  line-height: 1.2;
  ${({ $active }) => $active
    ? `
      background: linear-gradient(122deg, var(--purple-start) 0%, var(--purple-end) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    `
    : `color: var(--foreground);`
  }
`

const TabWeek = styled.div<{ $active: boolean }>`
  display: flex;
  gap: 2px;
  align-items: center;
  font-size: 10.5px;
  color: ${({ $active }) => $active ? 'var(--purple-start)' : 'var(--foreground)'};
`

const ContentPanel = styled.div`
  flex: 1;
  background: var(--background);
  border: 1px solid var(--border);
  border-radius: 8px;
  border-start-start-radius: 0;
  min-height: 352px;
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
  color: var(--purple-start);
  opacity: 0.6;
  margin-bottom: 8px;
`

const EmptyTitle = styled.p`
  font-size: 20px;
  font-weight: 500;
  color: var(--sea-ink);
  margin: 0;
`

const EmptyDescription = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 14px;
  flex: 1;
  color: var(--sea-ink-soft);
  line-height: 22px;
`