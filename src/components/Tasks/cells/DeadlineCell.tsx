import styled from "@emotion/styled"
import type { CellContext } from "@tanstack/react-table"
import { differenceInDays, startOfToday } from "date-fns"
import {
	DeadlineType,
	type TaskRowDto,
	WorkspaceStatusType,
} from "src/api/model"
import type { AppTableFeatures } from "src/utils/table-features"
import { formatDateShort } from "../../../functions/date-utils"
import { getDeadlineDisplayDate } from "../../../utils/deadline-utils"
import { DeadlineTypeTag } from "../../shared/DeadlineTypeTag"
import { Tooltip, TooltipContent, TooltipTrigger } from "../../ui/tooltip"

function getDeadlineTooltipText(daysUntil: number, isOverdue: boolean) {
	if (isOverdue) {
		return `חריגה של ${Math.abs(daysUntil)} ימים`
	}

	return daysUntil === 0 ? 'תג"ב היום' : 'תג"ב מחר'
}

export function DeadlineCell<TTask extends TaskRowDto, TValue>({
	row: {
		original: { deadlineType, dueDate, status, source, createdAt },
	},
}: CellContext<AppTableFeatures, TTask, TValue>) {
	const daysUntil = dueDate
		? differenceInDays(new Date(dueDate), startOfToday())
		: null

	const isOverdue =
		daysUntil !== null &&
		daysUntil < 0 &&
		deadlineType !== DeadlineType.IMMEDIATE

	const isApproaching =
		!isOverdue && daysUntil !== null && daysUntil >= 0 && daysUntil < 2

	const displayDate = getDeadlineDisplayDate(
		deadlineType,
		dueDate,
		source,
		createdAt,
	)

	const tooltipText =
		daysUntil !== null &&
		(isOverdue || isApproaching) &&
		status?.type !== WorkspaceStatusType.COMPLETED
			? getDeadlineTooltipText(daysUntil, isOverdue)
			: null

	const dateText = displayDate && (
		<DeadlineDateText $isOverdue={isOverdue} $isApproaching={isApproaching}>
			{formatDateShort(displayDate)}
		</DeadlineDateText>
	)

	return (
		<CellRoot>
			<DeadlineTypeTag type={deadlineType} />
			{dateText &&
				(tooltipText ? (
					<Tooltip>
						<TooltipTrigger asChild>{dateText}</TooltipTrigger>
						<TooltipContent>{tooltipText}</TooltipContent>
					</Tooltip>
				) : (
					dateText
				))}
		</CellRoot>
	)
}

const CellRoot = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`

const DeadlineDateText = styled.span<{
	$isOverdue?: boolean
	$isApproaching?: boolean
}>`
  font-size: var(--fs-btn);
  font-weight: 400;
  line-height: 22px;
  white-space: nowrap;

  color: ${({ $isOverdue, $isApproaching }) => {
		if ($isOverdue) {
			return "var(--Colors-Brand-Error-colorErrorActive)"
		}

		if ($isApproaching) {
			return "var(--Colors-Brand-Warning-colorWarningText)"
		}

		return "var(--sea-ink-soft)"
	}};
`
