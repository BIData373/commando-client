import styled from "@emotion/styled"
import { DeadlineType, type TaskRowDto } from "src/api/model"
import { AssigneeAvatar } from "src/components/shared/AssigneeAvatar"
import DeadlineTag, { DEADLINE_LABELS } from "src/components/shared/DeadlineTag"
import FlagIcon from "src/components/shared/FlagIcon"
import HighlightMatch from "src/components/shared/HighlightMatch"
import { StatusTag } from "src/components/shared/StatusTag"
import { formatDateShort } from "src/functions/date-utils"

interface MobileTaskCardProps {
	task: TaskRowDto
	searchQuery: string
	onClick: () => void
}

export default function MobileTaskCard({
	task,
	searchQuery,
	onClick,
}: MobileTaskCardProps) {
	const {
		title,
		description,
		status,
		dueDate,
		deadlineType,
		assignee,
		otherAssignees,
	} = task
	const extraCount = otherAssignees.length

	return (
		<CardRoot onClick={onClick}>
			<TopRow>
				<DateInfo>
					{dueDate && <DateValue>{formatDateShort(dueDate)}</DateValue>}
					{deadlineType === DeadlineType.DATE ? (
						dueDate && <DateLabel>תג"ב:</DateLabel>
					) : (
						<DeadlineTag $type={deadlineType}>
							{DEADLINE_LABELS[deadlineType]}
						</DeadlineTag>
					)}
				</DateInfo>
				<StatusTag status={status} />
			</TopRow>

			<TextBlock>
				<TaskText dir="auto">
					{task.flagged && <InlineFlag size={16} />}
					<TitleSpan>
						<HighlightMatch text={title} query={searchQuery} variant="mark" />
					</TitleSpan>
					{description && (
						<>
							{" - "}
							<DescriptionSpan>
								<HighlightMatch
									text={description}
									query={searchQuery}
									variant="mark"
								/>
							</DescriptionSpan>
						</>
					)}
				</TaskText>

				{assignee && (
					<>
						<Divider />
						<InfoRow>
							{extraCount > 0 && <ExtraBadge>+{extraCount}</ExtraBadge>}
							<AssigneeName>{assignee.name}</AssigneeName>
							<AssigneeAvatar assignee={assignee} size={28} />
							<InfoLabel>אחראי:</InfoLabel>
						</InfoRow>
					</>
				)}
			</TextBlock>
		</CardRoot>
	)
}

const CardRoot = styled.div`
	display: flex;
	flex-direction: column;
	gap: 12px;
	padding: 8px 12px;
	border-radius: 8px;
	background: var(--background);
`

const TopRow = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	align-self: stretch;
	align-items: flex-end;
`

const DateInfo = styled.div`
	display: flex;
	align-items: center;
	gap: 4px;
`

const DateLabel = styled.span`
	direction: rtl;
	font-size: var(--fs-btn);
	font-weight: 400;
	line-height: 22px;
	color: var(--text-color-400);
`

const DateValue = styled.span`
	font-size: var(--fs-btn);
	font-weight: 400;
	line-height: 22px;
	color: var(--text-color);
`

const TextBlock = styled.div`
	display: flex;
	flex-direction: column;
	gap: 4px;
	align-items: flex-end;
`

const TaskText = styled.p`
	direction: rtl;
	margin: 0;
	font-size: var(--fs-lg);
	line-height: 22px;
	color: var(--text-color-2);
	text-align: start;
	overflow: hidden;
	word-break: break-word;
`

const TitleSpan = styled.span`
	font-weight: 400;
`

const DescriptionSpan = styled.span`
	font-weight: 300;
`

const Divider = styled.hr`
	width: 100%;
	margin: 0;
	border: none;
	border-top: 1px solid var(--line);
`

const InfoRow = styled.div`
	display: flex;
	align-items: center;
	gap: 4px;
`

const InfoLabel = styled.span`
	direction: rtl;
	font-size: var(--fs-btn);
	font-weight: 400;
	color: var(--text-color-400);
`

const AssigneeName = styled.span`
	font-size: var(--fs-btn);
	font-weight: 400;
	color: var(--Colors-Neutral-Bg-colorBgSolidHover);
`

const ExtraBadge = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	width: 28px;
	height: 28px;
	border-radius: 24px;
	background: var(--chip-bg);
	font-size: var(--fs-sm);
	color: var(--sea-ink);
`

const InlineFlag = styled(FlagIcon)`
	display: inline;
	vertical-align: middle;
	margin-inline-end: 4px;
`
