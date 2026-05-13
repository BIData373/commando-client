import styled from '@emotion/styled'
import { Flag } from 'lucide-react'
import { format } from 'date-fns'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card'
import { StatusTag } from '../shared/StatusTag'
import type { Task } from '../../data/Tasks'
import DeadlineTag, { DEADLINE_LABELS } from '../shared/DeadlineTag'

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

