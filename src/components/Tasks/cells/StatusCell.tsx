import styled from "@emotion/styled"
import type { CellContext } from "@tanstack/react-table"
import {
	type TaskRowDto,
	type WorkspaceStatusDto,
	WorkspaceStatusType,
} from "src/api/model"
import type { AppTableFeatures } from "src/consts/table-features"
import { useTaskTable } from "src/providers/TaskTableProvider"
import { formatDateShort } from "../../../functions/date-utils"
import { Tooltip, TooltipContent, TooltipTrigger } from "../../ui/tooltip"
import { StatusDropdown } from "../StatusDropdown"

function getStatusTooltipText(
	isDone: boolean,
	inProcess: boolean,
	completedDate: Date,
) {
	if (isDone) {
		return `בוצע ב-${formatDateShort(completedDate)}`
	}
	if (inProcess) {
		return `החל עבודה ב${formatDateShort(completedDate)}`
	}
}

export function StatusCell<TTask extends TaskRowDto, TValue>({
	row: {
		original: {
			id,
			status,
			assignee,
			editable,
			personalArchivedAt,
			workspaceArchivedAt,
			updatedAt,
		},
	},
}: CellContext<AppTableFeatures, TTask, TValue>) {
	const { statuses, getHandlers } = useTaskTable()

	function handleUpdate(
		taskId: number,
		assigneeId: number | undefined,
		nextStatus: WorkspaceStatusDto,
	) {
		getHandlers().onUpdateStatus(taskId, assigneeId, nextStatus)
	}

	if (!status) {
		return null
	}

	const isDone = status.type === WorkspaceStatusType.COMPLETED

	const inProcess = status.type === WorkspaceStatusType.IN_PROGRESS

	const tooltipText =
		editable && (inProcess || isDone)
			? getStatusTooltipText(isDone, inProcess, new Date(updatedAt))
			: null

	const dropdown = (
		<StatusDropdown
			status={status}
			statuses={statuses}
			assigneeId={assignee?.id}
			editable={editable}
			taskId={id}
			isPersonalArchived={!!personalArchivedAt}
			isWorkspaceArchived={!!workspaceArchivedAt}
			onUpdate={handleUpdate}
		/>
	)

	return tooltipText ? (
		<Tooltip>
			<TooltipTrigger asChild>
				<TooltipAnchor>{dropdown}</TooltipAnchor>
			</TooltipTrigger>
			<TooltipContent>{tooltipText}</TooltipContent>
		</Tooltip>
	) : (
		dropdown
	)
}

const TooltipAnchor = styled.div`
  width: fit-content;
  margin-inline: auto;
`
