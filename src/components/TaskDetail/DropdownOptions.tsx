import styled from "@emotion/styled";
import { MoreVertical } from "lucide-react";
import { type IUser, UserRole } from "#/types";
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
    const functions = {
        onEdit: currentUser.role === UserRole.ADMIN ? onEdit : undefined,
        onArchive,
        onDelete: currentUser.role === UserRole.ADMIN ? onDelete : undefined,
    };

    return (
        <RowActionsMenu
            trigger={
                <DotsButton>
                    <MoreVertical size={16} />
                </DotsButton>
            }
            {...functions}
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
    background: var(--link-bg-hover);
    color: var(--sea-ink);
  }
`;
