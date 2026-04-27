import styled from '@emotion/styled'
import { Flag } from 'lucide-react'
import { format } from 'date-fns'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card'
import { StatusTag } from '../shared/StatusTag'
import type { Task } from '../../data/Tasks'
import { DEADLINE_LABELS, type DeadlineType } from './TaskTable'

interface TaskCardGridProps {
  tasks: Task[]
}

function TaskCardGrid({ tasks }: TaskCardGridProps) {
  return (
    <CardGridContainer>
      {tasks.map((task) => (
        <Card key={task.id}>
          <CardHeader>
            <CardTitle>
              <CardTitleRow>
                {task.title}
                {task.flagged && <Flag size={16} />}
              </CardTitleRow>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <StatusTag status={task.status} />
          </CardContent>
          <CardFooter>
            {task.deadlineType !== 'date' && (
              <DeadlineTag $type={task.deadlineType}>{DEADLINE_LABELS[task.deadlineType]}</DeadlineTag>
            )}
            {task.dueDate && (
              <CardDateText>{format(task.dueDate, 'dd/MM/yy')}</CardDateText>
            )}
          </CardFooter>
        </Card>
      ))}
    </CardGridContainer>
  )
}

export { TaskCardGrid }

const CardGridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
`

const CardTitleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`

const CardDateText = styled.span`
  font-size: 12px;
  color: var(--sea-ink-soft);
  margin-inline-start: auto;
`

const DeadlineTag = styled.span<{ $type: DeadlineType }>`
  display: inline-flex;
  align-items: center;
  padding: 1px 6px;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
  ${({ $type }) => {
    switch ($type) {
      case 'ongoing':
        return `
          background: rgba(230, 244, 255, 0.8);
          border: 1px solid rgba(145, 202, 255, 0.8);
          color: rgba(22, 119, 255, 0.9);
        `
      case 'immediate':
        return `
          background: #FFF1F0;
          border: 1px solid #FFA39E;
          color: #F5222D;
        `
      case 'date':
        return `
          background: var(--chip-bg);
          border: 1px solid var(--chip-line);
          color: var(--sea-ink-soft);
        `
    }
  }}
`
