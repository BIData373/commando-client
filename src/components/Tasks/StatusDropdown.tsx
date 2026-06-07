import styled from "@emotion/styled"
import { useState } from "react"
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
	taskId: number
	workspaceId: number
	assigneeId: number
	onUpdate: (taskId: number, assigneeId: number, statusId: number) => void
	withArrow?: boolean
}

export function StatusDropdown({
	status,
	taskId,
	assigneeId,
	workspaceId,
	onUpdate,
	withArrow = false,
}: StatusDropdownProps) {
	const [isOpen, setIsOpen] = useState(false)

	const { data: statuses = [], isLoading } = useListWorkspaceStatuses({
		workspaceId,
	})

	function handleSelectStatus(newStatusId: number) {
		onUpdate(taskId, assigneeId, newStatusId)
	}

	return (
		!isLoading && (
			<CellCenter>
				<DropdownMenu onOpenChange={setIsOpen}>
					<DropdownMenuTrigger asChild>
						<TriggerWrapper tabIndex={0}>
							<StatusTag
								status={status}
								interactive
								withArrow={withArrow}
								open={isOpen}
							/>
						</TriggerWrapper>
					</DropdownMenuTrigger>
					<StatusDropdownContent align="center" sideOffset={6}>
						{Object.values(statuses).map((s) => (
							<StatusDropdownItem
								key={s.id}
								$selected={s.id === status.id}
								onSelect={() => handleSelectStatus(s.id)}
							>
								<StatusTag status={s} />
							</StatusDropdownItem>
						))}
					</StatusDropdownContent>
				</DropdownMenu>
			</CellCenter>
		)
	)
}

const CellCenter = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
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

const StatusDropdownItem = styled(DropdownMenuItem)<{ $selected: boolean }>`
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
