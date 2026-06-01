import styled from "@emotion/styled";
import { ChevronDown } from "lucide-react";
import { type IWorkspaceSettings, STATUS_LABELS } from "src/types";
import { DirectiveStatus, statusColors } from "src/utils/statusUtils";
import { AssigneeAvatar } from "../shared/AssigneeAvatar";
import { StatusTag } from "../shared/StatusTag";
import type { RelatedDirective } from "../Tasks/ResponsibleCell";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu";

interface AsiggneeContainerProps {
	isAdmin: boolean;
	editable: boolean;
	assignee: RelatedDirective;
	workspaceSettings?: IWorkspaceSettings;
	onDirectiveStatusChange: (
		status: DirectiveStatus,
	) => void;
}

export const AssigneeContainer = ({
	isAdmin,
	editable,
	assignee,
	workspaceSettings,
	onDirectiveStatusChange,
}: AsiggneeContainerProps) => {
	const canEdit =
		editable &&
		(isAdmin || (workspaceSettings?.assigneeStatusEditable ?? false));
	return (
		<AssigneeRowContainer key={assignee.user.id} $white={editable && !isAdmin}>
			<AssigneeInfoBlock>
				<AssigneeAvatar assignee={assignee.user} />
				<AssigneeRoleText>{assignee.user.role}</AssigneeRoleText>
			</AssigneeInfoBlock>
			{canEdit ? (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<StatusPillTrigger $status={assignee.status}>
							{STATUS_LABELS[assignee.status]}
							<ChevronDown size={12} />
						</StatusPillTrigger>
					</DropdownMenuTrigger>
					<StatusDropdownContent align="center" sideOffset={6}>
						{Object.values(DirectiveStatus).map((s) => (
							<StatusDropdownItem
								key={s}
								$selected={s === assignee.status}
								onSelect={() => onDirectiveStatusChange(s)}
							>
								<StatusTag status={s} />
							</StatusDropdownItem>
						))}
					</StatusDropdownContent>
				</DropdownMenu>
			) : (
				<StatusTag status={assignee.status} />
			)}
		</AssigneeRowContainer>
	);
};

const StatusPillTrigger = styled.button<{ $status: DirectiveStatus }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 1px 8px;
  border-radius: 56px;
  width: 76px;
  max-width: 76px;
  border: none;
  font-size: 12px;
  line-height: 20px;
  white-space: nowrap;
  cursor: pointer;
  ${({ $status }) => {
		const { fontColor, bgColor } = statusColors[$status];
		return `background: ${bgColor}; color: ${fontColor};`;
	}}

  &:focus-visible {
    outline: none;
  }
`;

const StatusDropdownContent = styled(DropdownMenuContent)`
  width: 100px;
  min-width: 100px;
  padding: 8px 4px;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: center;
  z-index: 1000;
  box-shadow: 0px 6px 16px rgba(0, 0, 0, 0.08),
    0px 3px 6px rgba(0, 0, 0, 0.12),
    0px 9px 28px rgba(0, 0, 0, 0.05);
`;

const StatusDropdownItem = styled(DropdownMenuItem)<{ $selected: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 4px;
  border-radius: 4px;
  background: ${({ $selected }) => ($selected ? "var(--selected-item)" : "transparent")};
  cursor: pointer;
  outline: none;

  &[data-highlighted],
  &:hover {
    background: var(--selected-item);
    color: inherit;
  }
`;

const AssigneeRowContainer = styled.div<{ $white?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 24px;
  padding: 7px 12px;
  background: ${({ $white }) => ($white ? "var(--background)" : "var(--background-assignee)")};
  border: 0.5px solid var(--line);
  border-radius: 8px;
  width: 100%;
`;

const AssigneeInfoBlock = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
  justify-content: flex-start;
  width: 161px;
`;

const AssigneeRoleText = styled.span`
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  color: var(--text-color-2);
  white-space: nowrap;
`;
