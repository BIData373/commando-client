import styled from "@emotion/styled"
import { useToggle } from "@mantine/hooks"
import { memo } from "react"
import type { WorkspaceStatusDto } from "src/api/model"
import { useListWorkspaceStatuses } from "src/api/workspace-status/workspace-status"
import { HAS_ASSIGNEE_DATA_ATTR } from "src/utils/task-table-utils"
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
	workspaceId?: number
	taskId: number
	assigneeId?: number
	editable?: boolean
	onUpdate?: (
		taskId: number,
		assigneeId: number,
		status: WorkspaceStatusDto,
	) => void
}

export const StatusDropdown = memo(
	({
		status,
		statuses: providedStatuses,
		workspaceId,
		taskId,
		assigneeId,
		editable = false,
		onUpdate,
	}: StatusDropdownProps) => {
		const [isOpen, toggleOpen] = useToggle()

		const { data: fetchedStatuses = [], isLoading: isFetchingStatuses } =
			useListWorkspaceStatuses(
				{ workspaceId: workspaceId ?? -1 },
				{
					query: {
						enabled:
							providedStatuses === undefined && workspaceId !== undefined,
					},
				},
			)

		const statuses = providedStatuses ?? fetchedStatuses
		const statusesReady = statuses !== undefined && !isFetchingStatuses

		function handleSelectStatus(newStatus: WorkspaceStatusDto) {
			if (newStatus.id !== status.id && assigneeId) {
				onUpdate?.(taskId, assigneeId, newStatus)
			}
		}

		return (
			<CellCenter
				{...{ [HAS_ASSIGNEE_DATA_ATTR]: assigneeId ? "" : undefined }}
			>
				{editable && statusesReady ? (
					<DropdownMenu onOpenChange={toggleOpen}>
						<DropdownMenuTrigger asChild>
							<TriggerWrapper tabIndex={0} $hasAssignee={!!assigneeId}>
								<StatusTag
									open={isOpen}
									status={status}
									interactive
									editable
									withArrow={editable}
								/>
							</TriggerWrapper>
						</DropdownMenuTrigger>
						<StatusDropdownContent align="center" sideOffset={6}>
							{statuses.map((s) => (
								<StatusDropdownItem
									key={s.id}
									$selected={s.id === status.id}
									$hasAssignee={!!assigneeId}
									onSelect={() => handleSelectStatus(s)}
								>
									<StatusTag status={s} interactive editable={editable} />
								</StatusDropdownItem>
							))}
						</StatusDropdownContent>
					</DropdownMenu>
				) : (
					<StatusTag status={status} editable={editable} />
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

const TriggerWrapper = styled.span<{ $hasAssignee: boolean }>`
  cursor: ${({ $hasAssignee }) => ($hasAssignee ? "pointer" : "default")};

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
	$hasAssignee: boolean
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 4px;
  border-radius: 4px;
  background: ${({ $selected }) => ($selected ? "rgba(230, 244, 255, 1)" : "transparent")};
  cursor: ${({ $hasAssignee }) => ($hasAssignee ? "pointer" : "default")};
  outline: none;

  &[data-highlighted],
  &:hover {
    background: rgba(230, 244, 255, 1);
    color: inherit;
  }
`
