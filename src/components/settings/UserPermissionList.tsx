import styled from '@emotion/styled'
import type { IUser, UserRole } from '#/types'
import { TrashButtona'.edsha'.edshared/TrashButton'
import {
  DropdownPermissionmissionm"siDropdownPermission"ssion"ssion"

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
          <TrashButton
            onClick={() => onDelete(user.id)}
            size={22}
          />
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
  gap: 12px;
  padding: 8px 4px;
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
  font-size: 15px;
  font-weight: 500;
  color: var(--sea-ink);
`

const UserPersonalId = styled.span`
  font-size: 16px;
  font-weight: 400;
`

const UserSubtext = styled.span`
  font-size: 14px;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.65);
`