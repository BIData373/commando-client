import styled from '@emotion/styled'
import { X } from 'lucide-react'
import type { IUser } from '#/types'
import { UserItem } from './UserDropdownItem'

interface UsersListsProps {
    users: IUser[]
    onRemove: (id: number) => void
}

export function UsersLists({ users, onRemove }: UsersListsProps) {
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
  border-radius: 6px;
  background-color: var(--background-area);
  padding: 8px;
`

const UserCard = styled.div`
    padding: 1px 8px;
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
`

const UserCardItem = styled.div`
    display: flex;
    align-items: center;
    max-width: 224px;
    gap: 6px;
    padding-right: 8px;
    background: rgba(0, 0, 0, 0.02);
    border: 1px solid var(--card-border);
    border-radius: 4px;
`

const UserCardInfo = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    min-width: 0;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: clip;
    gap: 2px;
`

const UserCardClose = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    background: none;
    border: none;
    cursor: pointer;
    padding: 2px;
    color: rgba(0, 0, 0, 0.45);
    flex-shrink: 0;
    align-self: flex-start;

    &:hover {
        color: var(--sea-ink);
    }
`
