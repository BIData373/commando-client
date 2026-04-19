import styled from '@emotion/styled'
import { useQueryClient } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { AddUserSection } from '#/components/settings/AddUserSection'
import { SearchDropdown } from '#/components/settings/SearchDropdown'
import { UserItem } from '#/components/settings/UserDropdownItem'
import { UserPermissionList } from '#/components/settings/UsersPermissionList'
import { useAddUserToWorkspace, useDeleteUser, userKeys, useUpdateUser, useUsers, useWorkspaceUsers } from '#/hooks/useUsers'
import type { IUser } from '#/types'
import { UserRole } from '#/types'
import { concatName } from '#/utils/userUtils'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../../components/ui/tabs'

export const Route = createFileRoute('/workspace/$urlName/settings/permissions')({ component: SettingsPermissions })


enum PermissionsTab {
  ALL = 'all',
  ADMINS = 'admins',
  VIEWERS = 'viewers'
}

function SettingsPermissions() {
  const { urlName } = Route.useParams()
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState(PermissionsTab.ALL)
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null)

  const { data: permissionUsers = [] } = useWorkspaceUsers(urlName)
  const { data: allUsers = [] } = useUsers()

  const filteredUsers = search.trim()
    ? allUsers.filter((u) => u.name.includes(search) || u.email.includes(search))
    : []
  const { mutate: userUpdate } = useUpdateUser()
  const { mutate: addUserToWorkspace } = useAddUserToWorkspace()
  const { mutate: deleteUser } = useDeleteUser()

  const admins = permissionUsers.filter(u => u.role === UserRole.ADMIN)
  const viewers = permissionUsers.filter(u => u.role === UserRole.VIEWER)

  function handleUserAdd(role: UserRole) {
    if (!selectedUser) return
    addUserToWorkspace({ userId: selectedUser.id, urlName })
    userUpdate({ userId: selectedUser.id, data: { role } })
    setSearch('')
    setSelectedUser(null)
  }

  function handleDeletePermissionUser(userId: number) {
    deleteUser({ userId, urlName })
  }

  function handleRoleChangePermissionUser(_userId: number, _role: UserRole) {
    queryClient.invalidateQueries({ queryKey: userKeys.workspace(urlName) })
  }

  function handleTabChange(value: string) {
    setActiveTab(value as PermissionsTab)
  }

  return (
    <PermissionsRoot>
      <Subtitle>מנהל סביבה יוצר הנחיות, מגדיר אחראיים ומבצע בקרה ומעקב אחר סטטוס ההנחיות בסביבה</Subtitle>
      <SearchSection>
        <SearchDropdown<IUser>
          items={filteredUsers}
          value={search}
          onChange={(v) => { setSearch(v); if (!v) setSelectedUser(null) }}
          onSelect={(user) => { setSearch(concatName(user)); setSelectedUser(user) }}
          onClear={() => { setSearch(''); setSelectedUser(null) }}
          placeholder="חפש קבוצת אחראים"
          renderItem={(item) => <UserItem user={item} />}
        />
        {selectedUser &&
          <AddUserSection onClick={handleUserAdd} />
        }
      </SearchSection>
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <StyledTabsList variant="line">
          <TabsTrigger value={PermissionsTab.ALL}>כולם</TabsTrigger>
          <TabsTrigger value={PermissionsTab.ADMINS}>מנהלים</TabsTrigger>
          <TabsTrigger value={PermissionsTab.VIEWERS}>צופים</TabsTrigger>
        </StyledTabsList>
        <TabsContent value={PermissionsTab.ALL}>
          <UserPermissionList users={permissionUsers} onDelete={handleDeletePermissionUser} onRoleChange={handleRoleChangePermissionUser} />
        </TabsContent>
        <TabsContent value={PermissionsTab.ADMINS}>
          <UserPermissionList users={admins} onDelete={handleDeletePermissionUser} onRoleChange={handleRoleChangePermissionUser} />
        </TabsContent>
        <TabsContent value={PermissionsTab.VIEWERS}>
          <UserPermissionList users={viewers} onDelete={handleDeletePermissionUser} onRoleChange={handleRoleChangePermissionUser} />
        </TabsContent>
      </Tabs>
    </PermissionsRoot>
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