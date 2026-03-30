import styled from '@emotion/styled'
import { createFileRoute } from '@tanstack/react-router'
import { useMemo, useState } from 'react'
import { AddUserSection } from '#/components/settings/AddUserSection'
import { UserSearchInput } from '#/components/settings/UserSearchInput'
import { UserPermissionList } from '#/components/settings/UsersPermissionList'
import { useCreateUser, useUsers } from '#/hooks/useUsers'
import type { IUser } from '#/types'
import { UserRole } from '#/types'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../../components/ui/tabs'

export const Route = createFileRoute('/workspace/$urlName/settings/permissions')({ component: SettingsPermissions })

type PermissionsTab = 'all' | 'admins' | 'viewers'

function SettingsPermissions() {
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState<PermissionsTab>('all')
  const { data: users = [] } = useUsers();
  const { mutate: userCreate } = useCreateUser()

  const admins = useMemo(() => users.filter(u => u.role === UserRole.ADMIN), [users])
  const viewers = useMemo(() => users.filter(u => u.role === UserRole.VIEWER), [users])

  function handleUserAdd(role: UserRole) {
    const newUser: IUser = {
      id: Date.now(),
      name: search,
      email: '',
      avatarUrl: null,
      role,
      createdAt: Date.now().toString(),
      updatedAt: Date.now().toString(),
      lastLogin: null,
    }
    userCreate(newUser)
    setSearch('')
  }


  function handleTabChange(value: string) {
    setActiveTab(value as PermissionsTab)
  }

  return (
    <PermissionsRoot>
      <Subtitle>מנהל סביבה יוצר הנחיות, מגדיר אחראיים ומבצע בקרה ומעקב אחר סטטוס ההנחיות בסביבה</Subtitle>
      <SearchSection>
        <UserSearchInput
          value={search}
          onChange={setSearch}
          placeholder="חפש קבוצת אחראים"
          clearInput={search.length > 0}
        />
        {search.length > 0 &&
          <AddUserSection onClick={handleUserAdd} />
        }
      </SearchSection>
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <StyledTabsList variant="line">
          <TabsTrigger value="all">כולם</TabsTrigger>
          <TabsTrigger value="admins">מנהלים</TabsTrigger>
          <TabsTrigger value="viewers">צופים</TabsTrigger>
        </StyledTabsList>
        <TabsContent value="all">
          <UserPermissionList users={users} />
        </TabsContent>
        <TabsContent value="admins">
          <UserPermissionList users={admins} />
        </TabsContent>
        <TabsContent value="viewers">
          <UserPermissionList users={viewers} />
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