import styled from "@emotion/styled"
import type { WorkspaceStatusDto } from "src/api/model"
import { useWorkspace } from "src/providers/WorkspaceProvider"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import { StatusTag } from "./StatusTag"

// ─── Types ──────────────────────────────────────────────────────────────────

interface AssigneeStatusDropdownProps {
	status: WorkspaceStatusDto
	onStatusChange: (statusId: number) => void
}

// ─── Component ──────────────────────────────────────────────────────────────

export function AssigneeStatusDropdown({
	status,
	onStatusChange,
}: AssigneeStatusDropdownProps) {
	const { statuses } = useWorkspace()

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<TriggerWrapper>
					<StatusTag status={status} interactive />
				</TriggerWrapper>
			</DropdownMenuTrigger>
			<StatusDropdownContent align="center" sideOffset={6}>
				{Object.values(statuses).map((s) => (
					<StatusDropdownItem
						key={s.id}
						$selected={s.id === status.id}
						onSelect={() => onStatusChange(s.id)}
					>
						<StatusTag status={s} />
					</StatusDropdownItem>
				))}
			</StatusDropdownContent>
		</DropdownMenu>
	)
}

// ─── Styled Components ──────────────────────────────────────────────────────

const TriggerWrapper = styled.span`
  cursor: pointer;
  flex-shrink: 0;

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
