import styled from "@emotion/styled";
import { MoreVertical } from "lucide-react";
import { type IUser, UserRole } from "src/types";
import { RowActionsMenu } from "../Tasks/RowActionsMenu";

interface DropdownOptions {
	currentUser: IUser;
	onEdit(): void;
	onArchive(): void;
	onDelete(): void;
}

export const DropdownOptions = ({
	currentUser,
	onEdit,
	onArchive,
	onDelete,
}: DropdownOptions) => {
	return (
		<RowActionsMenu
			trigger={
				<DotsButton>
					<MoreVertical size={16} />
				</DotsButton>
			}
			onDelete={currentUser.role === UserRole.ADMIN ? onDelete : undefined}
			onArchive={onArchive}
			onEdit={currentUser.role === UserRole.ADMIN ? onEdit : undefined}
		/>
	);
};

const DotsButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  flex-shrink: 0;
  color: var(--sea-ink-soft);
  cursor: pointer;
  outline: none;

  &:hover {
    background: var(--button-hover);
    color: var(--sea-ink);
  }
`;
