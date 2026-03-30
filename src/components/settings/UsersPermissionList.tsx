import styled from '@emotion/styled'
import { Trash2 } from 'lucide-react'
import { useDeleteUser, useUpdateUser } from '#/hooks/useUsers'
import type { IUser, UserRole } from '#/types'
import { DropdownPermission } from "./DropdownPermission"

interface UserListProps {
    users: IUser[]
}


export function UserPermissionList({ users }: UserListProps) {
    const { mutate: userUpdate } = useUpdateUser()
    const { mutate: userDelete } = useDeleteUser()

    function handleRoleChange(id: number, newRole: UserRole) {
        userUpdate({
            userId: id,
            data: {
                role: newRole
            }
        })
    }

    return (
        <UserListRoot>
            {users.map((user) => (
                <UserRow key={user.id}>
                    <UserInfo>
                        <UserName>{user.name} - {user.id}</UserName>
                        <UserSubtext>{user.email}/{user.role}</UserSubtext>
                    </UserInfo>
                    <DropdownPermission
                        value={user.role}
                        onChange={(role) => handleRoleChange(user.id, role)}
                    />
                    <DeleteButton onClick={() => userDelete(user.id)}>
                        <Trash2 size={16} />
                    </DeleteButton>
                </UserRow>
            ))}
        </UserListRoot>
    )
}

const UserListRoot = styled.div`
  display: flex;
  flex-direction: column;
`

const UserRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 0;
  border-block-end: 1px solid var(--card-border);
  direction: rtl;
`

const UserInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
`

const UserName = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: var(--sea-ink);
`

const UserSubtext = styled.span`
  font-size: 12px;
  color: var(--sea-ink-soft);
`

const DeleteButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--sea-ink-soft);
  padding: 4px;
  flex-shrink: 0;

  &:hover {
    color: var(--sea-ink);
  }
`