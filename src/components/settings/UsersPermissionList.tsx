import styled from '@emotion/styled'
import { Trash2 } from 'lucide-react'
import { DropdownPermission, type RoleType } from "./DropdownPermission"

export interface FakeUser {
    id: number
    name: string
    personalId: string
    unit: string
    jobTitle: string
    role: RoleType
}

export const FAKE_USERS: FakeUser[] = [
    { id: 1, name: 'נועה לוי', personalId: 's3456789', unit: 'פד"ם 66/ אג"מ', jobTitle: 'ראש צוות', role: 'viewer' },
    { id: 2, name: 'ליאון אברמוב', personalId: 'm1234567', unit: 'גדוד 375/ אג"מ', jobTitle: 'מפקד צוות תכנון', role: 'viewer' },
    { id: 3, name: 'שירה פריידמן', personalId: 's7654321', unit: 'גדוד 376/ פלוגת טכנולוגיה', jobTitle: 'מהנדסת', role: 'viewer' },
    { id: 4, name: 'דניאל רוזן', personalId: 'm9876543', unit: 'גדוד 374/ אג"מ', jobTitle: 'רכז תכנון', role: 'viewer' },
    { id: 5, name: 'רון שמיר', personalId: 's9876543', unit: 'פד"ם 33/ מטה', jobTitle: 'ראש מחלקה', role: 'admin' },
    { id: 6, name: 'מיכל אברהם', personalId: 's7651321', unit: 'פד"ם 12/ אכ"א', jobTitle: 'מנהלת פרויקט', role: 'admin' },
]


interface UserListProps {
    users: FakeUser[]
}

export function UserPermissionList({ users }: UserListProps) {
    function handleTrashClick(id: number) {
        const userToDelete = FAKE_USERS.findIndex(user => user.id === id)
        FAKE_USERS.splice(userToDelete)
    }

    return (
        <UserListRoot>
            {users.map((user) => (
                <UserRow key={user.id}>
                    <UserInfo>
                        <UserName>{user.name} - {user.personalId}</UserName>
                        <UserSubtext>{user.unit}/ {user.jobTitle}</UserSubtext>
                    </UserInfo>
                    <DropdownPermission
                        value={user.role}
                        onChange={(role) => {
                            // handleRoleChange()
                        }}
                    />
                    <DeleteButton>
                        <Trash2
                            size={16}
                            onClick={() => handleTrashClick}
                        />
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