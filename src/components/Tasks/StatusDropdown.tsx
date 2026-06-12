import styled from "@emotion/styled"
import { useState } from "react"
import {
	PermissionType,
	type UserDto,
	type WorkspaceStatusDto,
} from "src/api/model"
import { useGetMyPermission } from "src/api/permission/permission"
import { useGetWorkspace } from "src/api/workspace/workspace"
import { useListWorkspaceStatuses } from "src/api/workspace-status/workspace-status"
import { useCurrentUser } from "src/hooks/useCurrentUser"
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
	assigneeUsers: UserDto[]
	onUpdate: (taskId: number, assigneeId: number, statusId: number) => void
	withArrow?: boolean
}

export function StatusDropdown({
	status,
	taskId,
	assigneeId,
	workspaceId,
	assigneeUsers,
	onUpdate,
	withArrow = false,
}: StatusDropdownProps) {
	const [isOpen, setIsOpen] = useState(false)

	const currentUser = useCurrentUser()
	const { data: workspace } = useGetWorkspace({ id: workspaceId })
	const { data: myPermission } = useGetMyPermission({ workspaceId })
	const { data: statuses = [], isLoading } = useListWorkspaceStatuses({
		workspaceId,
	})

	const isManager = myPermission?.type === PermissionType.MANAGER
	const isAssignee = assigneeUsers.some((u) => u.upn === currentUser.upn)
	const editable =
		isManager || (!!workspace?.assigneeStatusEditable && isAssignee)

	function handleSelectStatus(newStatusId: number) {
		if (newStatusId === status.id) return
		onUpdate(taskId, assigneeId, newStatusId)
	}

	return (
		!isLoading && (
			<CellCenter>
				{editable ? (
					<DropdownMenu onOpenChange={setIsOpen}>
						<DropdownMenuTrigger asChild>
							<TriggerWrapper tabIndex={0}>
								<StatusTag
									open={isOpen}
									status={status}
									interactive
									editable
									withArrow={withArrow}
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
				) : (
					<StatusTag status={status} />
				)}
			</CellCenter>
		)
	)
}

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
