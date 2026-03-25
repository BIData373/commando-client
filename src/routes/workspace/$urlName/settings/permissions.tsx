import styled from '@emotion/styled'
import { createFileRoute } from '@tanstack/react-router'
import { Search, Trash2, UserPlus, X } from 'lucide-react'
import { useState } from 'react'
import { SelectDropdownPermission } from '#/components/settings/SelectDropdownPermission'
import { InputGroup, InputGroupAddon, InputGroupInput } from '#/components/ui/input-group'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../../components/ui/tabs'

export const Route = createFileRoute('/workspace/$urlName/settings/permissions')({ component: SettingsPermissions })

type PermissionsTab = 'all' | 'admins' | 'viewers'

export interface FakeUser {
  id: number
  name: string
  personalId: string
  unit: string
  jobTitle: string
  role: 'viewer' | 'admin'
}

export const FAKE_USERS: FakeUser[] = [
  { id: 1, name: 'נועה לוי', personalId: 's3456789', unit: 'פד"ם 66/ אג"מ', jobTitle: 'ראש צוות', role: 'viewer' },
  { id: 2, name: 'ליאון אברמוב', personalId: 'm1234567', unit: 'גדוד 375/ אג"מ', jobTitle: 'מפקד צוות תכנון', role: 'viewer' },
  { id: 3, name: 'שירה פריידמן', personalId: 's7654321', unit: 'גדוד 376/ פלוגת טכנולוגיה', jobTitle: 'מהנדסת', role: 'viewer' },
  { id: 4, name: 'דניאל רוזן', personalId: 'm9876543', unit: 'גדוד 374/ אג"מ', jobTitle: 'רכז תכנון', role: 'viewer' },
  { id: 5, name: 'רון שמיר', personalId: 's9876543', unit: 'פד"ם 33/ מטה', jobTitle: 'ראש מחלקה', role: 'admin' },
  { id: 6, name: 'מיכל אברהם', personalId: 's7651321', unit: 'פד"ם 12/ אכ"א', jobTitle: 'מנהלת פרויקט', role: 'admin' },
  { id: 7, name: 'מיכל אברהם', personalId: 's7651321', unit: 'פד"ם 12/ אכ"א', jobTitle: 'מנהלת פרויקט', role: 'admin' },
  { id: 8, name: 'מיכל אברהם', personalId: 's7651321', unit: 'פד"ם 12/ אכ"א', jobTitle: 'מנהלת פרויקט', role: 'admin' },
  { id: 9, name: 'מיכל אברהם', personalId: 's7651321', unit: 'פד"ם 12/ אכ"א', jobTitle: 'מנהלת פרויקט', role: 'admin' },
  { id: 10, name: 'מיכל אברהם', personalId: 's7651321', unit: 'פד"ם 12/ אכ"א', jobTitle: 'מנהלת פרויקט', role: 'admin' },
]


interface UserListProps {
  users: FakeUser[]
}

function UserList({ users }: UserListProps) {
  return (
    <UserListRoot>
      {users.map((user) => (
        <UserRow key={user.id}>
          <UserInfo>
            <UserName>{user.name} - {user.personalId}</UserName>
            <UserSubtext>{user.unit}/ {user.jobTitle}</UserSubtext>
          </UserInfo>
          <SelectDropdownPermission initialRole={user.role} />
          <DeleteButton>
            <Trash2 size={16} />
          </DeleteButton>
        </UserRow>
      ))}
    </UserListRoot>
  )
}

function SettingsPermissions() {
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState<PermissionsTab>('all')

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearch(e.target.value)
  }

  function handleTabChange(value: string) {
    setActiveTab(value as PermissionsTab)
  }

  function handleClearSearch() {
    setSearch('')
  }

  return (
    <PermissionsRoot>
      <Subtitle>מנהל סביבה יוצר הנחיות, מגדיר אחראיים ומבצע בקרה ומעקב אחר סטטוס ההנחיות בסביבה</Subtitle>
      <SearchSection>
        <InputGroup>
          <InputGroupAddon align={search.length === 0 ? "inline-start" : "inline-end"}>
            {search.length === 0 ?
              <Search size={16} />
              :
              <X
                size={16}
                onClick={handleClearSearch}
                cursor={"pointer"}
              />
            }
          </InputGroupAddon>
          <InputGroupInput value={search} onChange={handleSearchChange} placeholder="חפש קבוצת אחראים" />
        </InputGroup>
        {search.length > 0 &&
          <AddUserRow>
            <SelectDropdownPermission ghost initialRole="viewer" />
            <AddAvatarButton>
              <UserPlus size={16} />
            </AddAvatarButton>
          </AddUserRow>
        }
      </SearchSection>
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <StyledTabsList variant="line">
          <TabsTrigger value="all">כולם</TabsTrigger>
          <TabsTrigger value="admins">מנהלים</TabsTrigger>
          <TabsTrigger value="viewers">צופים</TabsTrigger>
        </StyledTabsList>
        <TabsContent value="all">
          <UserList users={FAKE_USERS} />
        </TabsContent>
        <TabsContent value="admins">
          <UserList users={FAKE_USERS.filter((u) => u.role === 'admin')} />
        </TabsContent>
        <TabsContent value="viewers">
          <UserList users={FAKE_USERS.filter((u) => u.role === 'viewer')} />
        </TabsContent>
      </Tabs>
    </PermissionsRoot >
  )
}


const PermissionsRoot = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 600px;
`

const Subtitle = styled.p`
  font-size: 14px;
  color: var(--sea-ink-soft);
  margin: 0;
`

const StyledTabsList = styled(TabsList)`
  align-self: flex-end;
  direction: rtl;
`

const SearchSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  gap: 4px;
`

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
  color: white;
  border: none;
  cursor: pointer;
`

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