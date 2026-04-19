import styled from '@emotion/styled'
import { X } from 'lucide-react'
import type { IUser } from '#/types'
import { UserItem } from './UserDropdownItem'

interface UserListsProps {
    users: IUser[]
    onRemove: (id: number) => void
}

export function UserLists({ users, onRemove }: UserListsProps) {
    return (
        <UserListArea>
            {users.length > 0 && (
                <UserCard>
                    {users.map(user => (
                        <UserCardItem key={user.id}>
                            <UserCardInfo>
                                <UserItem user={user} />
                            </UserCardInfo>
                            <UserCardClose type="button" onClick={() => onRemove(user.id)}>
                                <X size={12} />
                            </UserCardClose>
                        </UserCardItem>
                    ))}
                </UserCard>
            )}
        </UserListArea>
    )
}

const UserListArea = styled.div`
  min-height: 127px;
  max-height: 127px;
  width: 100%;
  overflow-y: auto;
  scrollbar-width: thin;
  border-radius: 8px;
  background-color: var(--background-area);
  padding: 8px;
`

const UserCard = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    justify-content: flex-start;
`

const UserCardItem = styled.div`
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 1px 8px;
    background: rgba(0, 0, 0, 0.02);
    border: 1px solid var(--card-border);
    border-radius: 4px;
`

const UserCardInfo = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    overflow: hidden;
    word-wrap: break-word;
    text-overflow: ellipsis;
    gap: 2px;
    text-align: end;
`

const UserCardClose = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    background: none;
    border: none;
    cursor: pointer;
    padding: 2px;
    color: var(--sea-ink-soft);
    flex-shrink: 0;

    &:hover {
        color: var(--sea-ink);
    }
`
