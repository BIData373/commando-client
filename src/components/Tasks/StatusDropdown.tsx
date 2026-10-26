import styled from "@emotion/styled"
import { useToggle } from "@mantine/hooks"
import { memo } from "react"
import type { WorkspaceStatusDto } from "src/api/model"
import { useListWorkspaceStatuses } from "src/api/workspace-status/workspace-status"
import { useIsMobile } from "src/hooks/use-mobile"
import { MobileDrawer } from "../Mobile/MobileDrawer"
import { MobileStatusSelect } from "../Mobile/task/MobileStatusSelect"
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
	fullWidth?: boolean
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
		fullWidth,
	}: StatusDropdownProps) => {
		const isMobile = useIsMobile()
		const [isOpen, toggleOpen] = useToggle()

		const { data: fetchedStatuses = [], isLoading: isFetchingStatuses } =
			useListWorkspaceStatuses(
				{ workspaceId: status.workspaceId },
				{ query: { enabled: providedStatuses === undefined } },
			)

		const statuses = providedStatuses ?? fetchedStatuses
		const statusesReady = statuses !== undefined && !isFetchingStatuses
		const tooltip = isArchived
			? "ההנחיה נמצאת בארכיון סביבת המפקד - לא ניתן לערוך סטטוס"
			: undefined

		function handleSelectStatus(newStatus: WorkspaceStatusDto) {
			if (newStatus.id !== status.id) {
				onUpdate(taskId, assigneeId, newStatus)
			}
		}

		function handleSelectStatusMobile(newStatus: WorkspaceStatusDto) {
			handleSelectStatus(newStatus)
			toggleOpen()
		}

		const statusTagRef = (
			<StatusTag
				fullWidth={fullWidth}
				open={isOpen}
				status={status}
				interactive
				editable={editable}
				withArrow={editable}
				tooltip={tooltip}
			/>
		)

		return (
			<CellCenter>
				{editable && statusesReady ? (
					isMobile ? (
						<MobileDrawer
							open={isOpen}
							onOpenChange={toggleOpen}
							title="בחירת סטטוס"
							trigger={statusTagRef}
						>
							{statuses.map((currentStatus) => (
								<MobileStatusSelect
									key={currentStatus.id}
									selected={currentStatus.id === status.id}
									onSelect={() => handleSelectStatusMobile(currentStatus)}
								>
									<StatusTag
										fullWidth={fullWidth}
										status={currentStatus}
										interactive
										editable={editable}
										tooltip={tooltip}
									/>
								</MobileStatusSelect>
							))}
						</MobileDrawer>
					) : (
						<DropdownMenu onOpenChange={toggleOpen}>
							<DropdownMenuTrigger asChild>
								<TriggerWrapper tabIndex={0}>{statusTagRef}</TriggerWrapper>
							</DropdownMenuTrigger>
							<StatusDropdownContent align="center" sideOffset={6}>
								{statuses.map((currentStatus) => (
									<StatusDropdownItem
										key={currentStatus.id}
										$selected={currentStatus.id === status.id}
										onSelect={() => handleSelectStatus(currentStatus)}
									>
										<StatusTag
											fullWidth={fullWidth}
											status={currentStatus}
											interactive
											editable={editable}
											tooltip={tooltip}
										/>
									</StatusDropdownItem>
								))}
							</StatusDropdownContent>
						</DropdownMenu>
					)
				) : (
					<StatusTag
						status={status}
						editable={editable}
						tooltip={tooltip}
						fullWidth={fullWidth}
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
  width: 76px;

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
