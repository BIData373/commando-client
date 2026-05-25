import styled from '@emotion/styled'
import { formatDateToDateMonthFullYear, formatDateToMinutesHours } from '#/utils/timeFormat'
import { ChevronsLeft } from 'lucide-react'
import type { HistoryAction, HistoryChange } from '../../types/history'
import { keyframes } from '@emotion/react'

interface TaskHistoryPanelProps {
  history: HistoryChange[]
  onClose: () => void
}

interface HistoryGroup {
  userId: number
  name: string
  timestamp: Date
  changes: Array<{ action: HistoryAction; field: string; value: string }>
}

function groupHistoryEntries(history: HistoryChange[]): HistoryGroup[] {
  const groups: HistoryGroup[] = []
  for (const entry of history) {
    const last = groups[groups.length - 1]
    if (last && last.userId === entry.userId && last.timestamp.getTime() === entry.timestamp.getTime()) {
      last.changes.push({ action: entry.action, field: entry.field, value: entry.value })
    } else {
      groups.push({
        userId: entry.userId,
        name: entry.name,
        timestamp: entry.timestamp,
        changes: [{ action: entry.action, field: entry.field, value: entry.value }],
      })
    }
  }
  return groups
}

function getActionLabel(action: HistoryAction, field: string): string {
  if (action === 'create') return 'יצר את הפריט:'
  if (action === 'delete') return `נמחק ${field}:`
  return `עודכן ${field}:`
}

function TaskHistoryPanel({ history, onClose }: TaskHistoryPanelProps) {
  const groups = groupHistoryEntries(history)

  return (
    <PanelWrapper>
      <Header>
        <CloseBtn onClick={onClose} aria-label="סגור היסטוריה">
          <ChevronsLeft size={16} />
        </CloseBtn>
        <Title>היסטורית שינוים</Title>
      </Header>

      <Divider />

      <ScrollArea>
        <TimelineList>
          {groups.map((group, index) => {
            const isLast = index === groups.length - 1
            return (
              <TimelineItem key={`${group.userId}-${group.timestamp.getTime()}`}>
                <ConnectorColumn>
                  {isLast ? (
                    <>
                      <ConnectorLine $flex />
                      <Dot />
                    </>
                  ) : (
                    <>
                      <Dot />
                      <ConnectorLine $flex />
                    </>
                  )}
                </ConnectorColumn>

                <ItemContent>
                  <MetaRow>
                    <UserGroup>
                      <UserName>{group.name}</UserName>
                      <UserSeparetor>-</UserSeparetor>
                      <UserId>{group.userId}</UserId>
                    </UserGroup>
                    <TimeGroup>
                      <DateText>{formatDateToDateMonthFullYear(group.timestamp)}</DateText>
                      <TimeSeparator />
                      <TimeText>{formatDateToMinutesHours(group.timestamp)}</TimeText>
                    </TimeGroup>
                  </MetaRow>

                  <ChangeCard>
                    {group.changes.map((change, i) => (
                      <ChangeRow key={i}>
                        <ChangeLabel>{getActionLabel(change.action, change.field)}</ChangeLabel>
                        <ChangeValue>{change.value}</ChangeValue>
                      </ChangeRow>
                    ))}
                  </ChangeCard>
                </ItemContent>


              </TimelineItem>
            )
          })}
        </TimelineList>
      </ScrollArea>
    </PanelWrapper>
  )
}

export default TaskHistoryPanel

// ─── Animation ─────────────────────────────────────────────────────────────────

const slideInLeft = keyframes`
  from { transform: translateX(-100%); }
  to   { transform: translateX(0); }
`

// ─── Layout ────────────────────────────────────────────────────────────────────

const PanelWrapper = styled.div`
  position: absolute;
  z-index: 2;
  left: 0;
  top: 0;
  bottom: 0;
  width: 430px;
  background: white;
  border-inline-end: 1px solid var(--line);
  box-shadow: 4px 0 16px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  animation: ${slideInLeft} 0.22s ease-out both;
`

const Header = styled.div`
  display: flex;
  align-items: center;
  padding: 16px;
  flex-shrink: 0;
`

const Title = styled.h2`
  font-size: 20px;
  font-weight: 500;
  line-height: 28px;
  color: var(--sea-ink);
  margin: 0;
`

const CloseBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  color: var(--sea-ink-soft);
  cursor: pointer;
  flex-shrink: 0;

  
  &:hover {
    background: rgba(0, 0, 0, 0.06);
    color: var(--sea-ink);
  }
  
  &:active {
    background: rgba(0, 0, 0, 0.2);
    color: var(--sea-ink);
  }
`

const Divider = styled.div`
  height: 1px;
  background: var(--line);
  flex-shrink: 0;
`

const ScrollArea = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 24px 16px;
`

// ─── Timeline ──────────────────────────────────────────────────────────────────

const TimelineList = styled.div`
  display: flex;
  flex-direction: column;
`

const TimelineItem = styled.div`
  display: flex;
  gap: 16px;
  align-items: stretch;
`

const ItemContent = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding-block: 8px;
`

const ConnectorColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-inline: 1.5px;
  flex-shrink: 0;
`

const Dot = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #6366f1;
  flex-shrink: 0;
`

const ConnectorLine = styled.div<{ $flex?: boolean }>`
  width: 2px;
  background: #e5e7eb;
  ${({ $flex }) => $flex && 'flex: 1; min-height: 4px;'}
`

// ─── Meta row ──────────────────────────────────────────────────────────────────

const MetaRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`

const TimeGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`

const TimeText = styled.span`
  font-size: 12px;
  font-weight: 400;
  line-height: 20px;
  color: var(--text-color-400);
  white-space: nowrap;
`

const TimeSeparator = styled.div`
  width: 1px;
  height: 12px;
  background: rgba(0, 0, 0, 0.2);
`

const DateText = styled.span`
  font-size: 12px;
  font-weight: 400;
  line-height: 20px;
  color: var(--text-color-400);
  white-space: nowrap;
`

const UserGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`

const UserName = styled.span`
  font-size: 12px;
  font-weight: 500;
  line-height: 20px;
  color: var(--text-color);
  white-space: nowrap;
`

const UserSeparetor = styled.span`
  color: #D9D9D9;
`

const UserId = styled.span`
  font-size: 12px;
  font-weight: 400;
  line-height: 20px;
  color: var(--text-color);
  white-space: nowrap;
`

// ─── Change card ───────────────────────────────────────────────────────────────

const ChangeCard = styled.div`
  background: var(--background-area);
  border-radius: 4px;
  padding: 4px 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: flex-start;
`

const ChangeRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 4px;
`

const ChangeLabel = styled.span`
  font-size: 12px;
  font-weight: 500;
  line-height: 20px;
  color: var(--text-color);
  white-space: nowrap;
  flex-shrink: 0;
`

const ChangeValue = styled.p`
  font-size: 12px;
  font-weight: 400;
  line-height: 20px;
  color: var(--text-color);
  text-align: end;
  flex: 1;
  min-width: 0;
  background: rgba(0, 0, 0, 0.02);
  padding: 1px 8px;
  border-radius: 4px;
`
