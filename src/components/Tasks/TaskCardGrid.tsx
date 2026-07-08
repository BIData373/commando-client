import styled from "@emotion/styled"
import { Flag } from "lucide-react"
import { DeadlineType, type TaskRowDto } from "src/api/model"
import { formatDateShort } from "../../functions/date-utils"
import DeadlineTag, { DEADLINE_LABELS } from "../shared/DeadlineTag"
import { StatusTag } from "../shared/StatusTag"
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "../ui/card"

interface TaskCardGridProps {
	taskRows: TaskRowDto[]
}

function TaskCardGrid({ taskRows }: TaskCardGridProps) {
	return (
		<CardGridContainer>
			{taskRows.map((task) => (
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
						{task.status && <StatusTag status={task.status} />}
					</CardContent>
					<CardFooter>
						{task.deadlineType !== DeadlineType.DATE && (
							<DeadlineTag $type={task.deadlineType}>
								{DEADLINE_LABELS[task.deadlineType]}
							</DeadlineTag>
						)}
						{task.dueDate && (
							<CardDateText>{formatDateShort(task.dueDate)}</CardDateText>
						)}
					</CardFooter>
				</Card>
			))}
		</CardGridContainer>
	)
}

export { TaskCardGrid }

const CardGridContainer = styled.div`
  direction: rtl;
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
  font-size: var(--fs-sm);
  color: var(--sea-ink-soft);
  margin-inline-start: auto;
`
