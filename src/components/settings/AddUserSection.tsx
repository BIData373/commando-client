import styled from '@emotion/styled';
import { UserPlus } from 'lucide-react';
import { useState } from 'react';
import { UserRole } from '#/types';
import { DropdownPermission } from './DropdownPermission';


interface IAddUserWithPermissions {
    onClick(role: UserRole): void
}


export function AddUserSection({ onClick }: IAddUserWithPermissions) {
    const [role, setRole] = useState<UserRole>(UserRole.VIEWER);

    function handleAddUserClick() {
        onClick(role)
    }

    return (
        <AddUserRow>
            <DropdownPermission
                ghost
                value={role}
                onChange={setRole}
            />
            <AddAvatarButton onClick={handleAddUserClick}>
                <UserPlus size={16} />
            </AddAvatarButton>
        </AddUserRow>
    )
}

const AddUserRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  gap: 8px;
`


const AddAvatarButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  border-radius: 20px;
  background: var(--color-primary);
  color: var(--color-primary-foreground);
  border: none;
  cursor: pointer;
`
