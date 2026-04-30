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
  border-radius: 6px;
  background-color: var(--background-area);
  padding: 8px;
`

const UserCard = styled.div`
    padding: 1px 8px;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
    gap: 10px;
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
    color: var(--sea-ink-soft);
    flex-shrink: 0;

    &:hover {
        color: var(--sea-ink);
    }
`
