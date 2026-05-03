import styled from '@emotion/styled';
import { UserPlus } from 'lucide-react';
import { useState } from 'react';
import { UserRole } from '#/types';
import { DropdownPermission } from './DropdownPermission';


interface IAddUserWithPermissions {
    onClick(role: UserRole): void
    disabled: boolean
}


export function AddUserSection({ onClick, disabled }: IAddUserWithPermissions) {
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
                disabled={disabled}
            />
            <AddAvatarButton onClick={handleAddUserClick} $enabled={!disabled}>
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


const AddAvatarButton = styled.button<{ $enabled: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  color: ${({ $enabled }) => ($enabled ? 'var(--color-primary-foreground)' : 'var(--muted-foreground)')};
  cursor: ${({ $enabled }) => ($enabled ? 'pointer' : 'default')};
  background: ${({ $enabled }) => ($enabled ? 'linear-gradient(135deg, #615FFF 0%, #9810FA 100%)' : 'rgba(0, 0, 0, 0.04)')};
`
