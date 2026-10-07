import styled from "@emotion/styled"
import { Calendar } from "lucide-react"
import { DeadlineType, type SourceDto } from "src/api/model"
import { getDeadlineDisplayDate } from "src/utils/deadline-utils"
import { formatDateMonthYear } from "src/utils/time-format"
import { DeadlineTypeTag } from "./DeadlineTypeTag"

interface DueDateGroupProps {
	deadlineType: DeadlineType
	dueDate: Date | null
	source: SourceDto | null
	createdAt: Date
}

export function DueDateGroup({
	deadlineType,
	dueDate,
	source,
	createdAt,
}: DueDateGroupProps) {
	const displayDate = getDeadlineDisplayDate(
		deadlineType,
		dueDate,
		source,
		createdAt,
	)
	const showDueDateMeta = deadlineType !== DeadlineType.IMMEDIATE
	return (
		<Wrapper>
			<DeadlineTypeTag type={deadlineType} />
			{displayDate && (
				<DateContainer>
					{showDueDateMeta && <MetaLabel>עד</MetaLabel>}
					<DueDateText>{formatDateMonthYear(displayDate)}</DueDateText>
					{showDueDateMeta && <Calendar size={16} />}
				</DateContainer>
			)}
		</Wrapper>
	)
}

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--text-color);
`
const DateContainer = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`

const MetaLabel = styled.span`
  font-size: var(--fs-btn);
  font-weight: 400;
  line-height: 22px;
  color: var(--text-color);
`

const DueDateText = styled.span`
  font-size: var(--fs-btn);
  font-weight: 400;
  line-height: 22px;
  color: var(--text-color);
`
