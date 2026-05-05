import styled from '@emotion/styled'
import compleateInstruction from '../../assets/icons/completeInstruction.svg'
import type { Task } from '../../data/Tasks'
import FlagIcon from '../shared/FlagIcon'
import { StatusTag } from '../shared/StatusTag'
import { ResponsibleCell } from '../Tasks/ResponsibleCell'
import { EmptyCardState } from './EmptyCardState'
import { ViewMoreInstructions } from './ViewMoreInstructions'

interface RecentlyCompletedProps {
  urlName: string
  tasks: Task[]
}

export default function RecentlyCompleted({ urlName, tasks }: RecentlyCompletedProps) {
  const completedTasks = tasks.filter((t) => t.status === 'completed')

  return (
    <Section>
      <SectionTitle>הנחיות שבוצעו לאחרונה</SectionTitle>
      <Card $hasContent={completedTasks.length > 0}>
        {completedTasks.length === 0 ? (
          <EmptyCardState
            imgSrc={compleateInstruction}
            title='טרם בוצעו הנחיות'
            description={'לאחר שהנחיות יבצעו,\nההנחיות האחרונות יופיעו כאן'}
          />
        ) : (
          <TaskList>
            {completedTasks.map((task) => (
              <TaskRow key={task.id}>
                <TitleCellWrapper>
                  {task.flagged && <FlagIcon />}
                  <TitleText>
                    {task.title}
                    {task.details ? ` - ${task.details}` : ''}
                  </TitleText>
                </TitleCellWrapper>
                <FixedCell $width={100}>
                  <StatusTag status={task.status} />
                </FixedCell>
                <FixedCell $width={148}>
                  <ResponsibleCell
                    responsible={task.responsible}
                    relatedDirectives={task.relatedDirectives}
                  />
                </FixedCell>
              </TaskRow>
            ))}
          </TaskList>
        )}
      </Card>
      {/* TODO: filter by status = done */}
      <ViewMoreInstructions urlName={urlName} filter={undefined} />
    </Section>
  )
}

const Section = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 24px;

  @media (max-width: 1100px) {
    grid-column: 1 / -1;
    grid-row: 3;
  }
`

const SectionTitle = styled.h2`
  margin: 0;
  font-size: 30px;
  font-weight: 400;
  color: var(--sea-ink);
  text-align: start;
`

const Card = styled.div<{ $hasContent: boolean }>`
  flex: 1;
  background: var(--background);
  border: 1px solid var(--border);
  border-radius: 8px;
  min-height: 320px;
  overflow: hidden;
  box-shadow: 0 1px 2px oklch(0 0 0 / 0.03), 0 1px 6px -1px oklch(0 0 0 / 0.02), 0 2px 4px oklch(0 0 0 / 0.02);
  ${({ $hasContent }) =>
    $hasContent
      ? `
      display: flex;
      flex-direction: column;
      align-items: stretch;
      justify-content: flex-start;
    `
      : `
      display: flex;
      align-items: center;
      justify-content: center;
    `}
`

const TaskList = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`

const TaskRow = styled.div`
  display: flex;
  align-items: center;
  height: 44px;
  background: rgba(0, 0, 0, 0.02);

  &:nth-of-type(even) {
    background: rgba(0, 0, 0, 0);
  }
`

const TitleCellWrapper = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 10px;
  height: 100%;
  padding: 10px 12px;
  background: var(--background);
  direction: rtl;
  border: 0.5px solid rgba(0, 0, 0, 0.01);
`

const TitleText = styled.span`
  flex: 1;
  min-width: 0;
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  color: var(--sea-ink);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: start;
`

const FixedCell = styled.div<{ $width: number }>`
  width: ${({ $width }) => $width}px;
  flex-shrink: 0;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 8px;
  padding-inline: 12px;
  background: var(--background);
  direction: rtl;
  border: 0.5px solid rgba(0, 0, 0, 0.01);
`
