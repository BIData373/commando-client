import styled from "@emotion/styled"
import { useToggle } from "@mantine/hooks"
import { memo } from "react"
import type { WorkspaceStatusDto } from "src/api/model"
import { useListWorkspaceStatuses } from "src/api/workspace-status/workspace-status"
import { StatusTag } from "../shared/StatusTag"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu"

interface StatusDropdownProps {
	status: WorkspaceStatusDto
	statuses?: WorkspaceStatusDto[]
	taskId: number
	assigneeId?: number
	editable?: boolean
	isArchived?: boolean
	onUpdate: (
		taskId: number,
		assigneeId: number | undefined,
		status: WorkspaceStatusDto,
	) => void
}

export const StatusDropdown = memo(
	({
		status,
		statuses: providedStatuses,
		taskId,
		assigneeId,
		editable = false,
		isArchived,
		onUpdate,
	}: StatusDropdownProps) => {
		const [isOpen, toggleOpen] = useToggle()

		const { data: fetchedStatuses = [], isLoading: isFetchingStatuses } =
			useListWorkspaceStatuses(
				{ workspaceId: status.workspaceId },
				{ query: { enabled: providedStatuses === undefined } },
			)

		const statuses = providedStatuses ?? fetchedStatuses
		const statusesReady = statuses !== undefined && !isFetchingStatuses

		const statusEditable = editable && !isArchived
		const tooltip = isArchived ? "לא ניתן לערוך סטטוס הנחיה בארכיון" : undefined

		function handleSelectStatus(newStatus: WorkspaceStatusDto) {
			if (newStatus.id !== status.id) {
				onUpdate(taskId, assigneeId, newStatus)
			}
		}

		return (
			<CellCenter>
				{statusEditable && statusesReady ? (
					<DropdownMenu onOpenChange={toggleOpen}>
						<DropdownMenuTrigger asChild>
							<TriggerWrapper tabIndex={0}>
								<StatusTag
									open={isOpen}
									status={status}
									interactive
									editable={statusEditable}
									withArrow={statusEditable}
									tooltip={tooltip}
								/>
							</TriggerWrapper>
						</DropdownMenuTrigger>
						<StatusDropdownContent align="center" sideOffset={6}>
							{statuses.map((currentStatus) => (
								<StatusDropdownItem
									key={currentStatus.id}
									$selected={currentStatus.id === status.id}
									onSelect={() => handleSelectStatus(currentStatus)}
								>
									<StatusTag
										status={currentStatus}
										interactive
										editable={statusEditable}
										tooltip={tooltip}
									/>
								</StatusDropdownItem>
							))}
						</StatusDropdownContent>
					</DropdownMenu>
				) : (
					<StatusTag
						status={status}
						editable={statusEditable}
						tooltip={tooltip}
					/>
				)}
			</CellCenter>
		)
	},
)

const CellCenter = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`

const TriggerWrapper = styled.span`
  cursor: pointer;

  &:focus-visible {
    outline: none;
  }
`

const StatusDropdownContent = styled(DropdownMenuContent)`
  width: 100px;
  min-width: 100px;
  padding: 8px 4px;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: center;
  box-shadow: 0px 6px 16px rgba(0, 0, 0, 0.08),
    0px 3px 6px rgba(0, 0, 0, 0.12),
    0px 9px 28px rgba(0, 0, 0, 0.05);
`

const StatusDropdownItem = styled(DropdownMenuItem)<{
	$selected: boolean
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 4px;
  border-radius: 4px;
  background: ${({ $selected }) => ($selected ? "rgba(230, 244, 255, 1)" : "transparent")};
  cursor: pointer;
  outline: none;

  &[data-highlighted],
  &:hover {
    background: rgba(230, 244, 255, 1);
    color: inherit;
  }
`
