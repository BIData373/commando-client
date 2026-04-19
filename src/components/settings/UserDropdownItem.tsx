import styled from '@emotion/styled'
import type { IUser } from "#/types";

interface UserItemProps {
    user: IUser
}

export function UserItem({ user }: UserItemProps) {
    return (
        <>
            <UserName>{user.name} - {user.id}</UserName>
            <UserMeta>{user.email} / {user.role}</UserMeta>
        </>
    )
}

const UserName = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: var(--sea-ink);
`

const UserMeta = styled.span`
  font-size: 12px;
  color: var(--sea-ink-soft);
`