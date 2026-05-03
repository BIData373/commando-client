import styled from '@emotion/styled'
import { Trash2 } from 'lucide-react'
import type { IUser, UserRole } from '#/types'
import { DropdownPermission } from "./DropdownPermission"

interface UserPermissionListProps {
  users: IUser[]
  onDelete: (userId: number) => void
  onRoleChange: (userId: number, role: UserRole) => void
}

export function UserPermissionList({ users, onDelete, onRoleChange }: UserPermissionListProps) {
  return (
    <UserListRoot>
      {users.map((user) => (
        <UserRow key={user.id}>
          <UserInfo>
            <UserHeader>
              <UserName>{user.name}</UserName>
              <UserPersonalId> - {user.id}</UserPersonalId>
            </UserHeader>
            <UserSubtext>{user.email}</UserSubtext>
          </UserInfo>
          <DropdownPermission
            value={user.role}
            onChange={(role) => onRoleChange(user.id, role)}
          />
          <DeleteButton onClick={() => onDelete(user.id)}>
            <StyledTrash2 size={22} />
          </DeleteButton>
        </UserRow>
      ))}
    </UserListRoot>
  )
}

const UserListRoot = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  min-height: 0;
  overflow-y: auto;
`

const UserRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px 12px;
  border-block-end: 1px solid rgba(0, 0, 0, 0.06);
  direction: rtl;
`

const UserHeader = styled.div`
  display: flex;
  gap: 4px;
`

const UserInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
`

const UserName = styled.span`
  font-size: 18px;
  font-weight: 600;
  color: var(--sea-ink);
`
const UserPersonalId = styled.span`
  font-size: 16px;
`

const UserSubtext = styled.span`
  font-size: 16px;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.65);
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

const StyledTrash2 = styled(Trash2)`
  color: rgba(0, 0, 0, 0.3);
`
