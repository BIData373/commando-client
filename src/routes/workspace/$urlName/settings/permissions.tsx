import styled from '@emotion/styled'
import { useQueryClient } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { useMemo, useState } from 'react'
import { AddUserSection } from '#/components/settings/AddUserSection'
import { DropdownUsers } from '#/components/settings/DropdownUsers'
import { UserPermissionList } from '#/components/settings/UserPermissionList'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '#/components/ui/tabs'
import { useAddUserToWorkspace, useDeleteUser, userKeys, useUpdateUser, useWorkspaceUsers } from '#/hooks/useUsers'
import type { IUser } from '#/types'
import { UserRole } from '#/types'

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
  const { mutate: userUpdate } = useUpdateUser()
  const { mutate: addUserToWorkspace } = useAddUserToWorkspace()
  const { mutate: deleteUser } = useDeleteUser()

  const currentTabUsers = useMemo(() => {
    const taggedRole = activeTab === PermissionsTab.ADMINS ? UserRole.ADMIN : UserRole.VIEWER
    return activeTab === PermissionsTab.ALL ? permissionUsers : permissionUsers.filter(user => user.role === taggedRole)
  }, [activeTab, permissionUsers])


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

  function handleRoleChangePermissionUser(userId: number, role: UserRole) {
    userUpdate({ userId, data: { role } })
    queryClient.invalidateQueries({ queryKey: userKeys.workspace(urlName) })
  }

  function handleTabChange(value: string) {
    setActiveTab(value as PermissionsTab)
  }

  function handleSearchChange(v: string) {
    setSearch(v)
    if (!v) setSelectedUser(null)
  }

  function handleSearchSelect(user: IUser | null) {
    setSelectedUser(user)
  }

  function handleSearchClear() {
    setSearch('')
    setSelectedUser(null)
  }

  return (
    <PermissionsRoot>
      <PermissionsInner>
        <Subtitle>מנהל סביבה יוצר הנחיות, מגדיר אחראיים ומבצע בקרה ומעקב אחר סטטוס ההנחיות בסביבה</Subtitle>
        <SearchSection>
          <DropdownUsers
            value={search}
            onChange={handleSearchChange}
            onSelect={handleSearchSelect}
            onClear={handleSearchClear}
            placeholder="חפש קבוצת אחראים"
          />
          {selectedUser &&
            <AddUserSection onClick={handleUserAdd} />
          }
        </SearchSection>
        <StyledTabs value={activeTab} onValueChange={handleTabChange}>
          <StyledTabsList variant="line">
            <TabsTrigger value={PermissionsTab.ALL}>כולם</TabsTrigger>
            <TabsTrigger value={PermissionsTab.ADMINS}>מנהלים</TabsTrigger>
            <TabsTrigger value={PermissionsTab.VIEWERS}>צופים</TabsTrigger>
          </StyledTabsList>
          {Object.values(PermissionsTab).map((tab, i) => (
            <StyledTabsContent key={i} value={tab}>
              <UserListScrollArea>
                <UserListInner>
                  <UserPermissionList users={currentTabUsers} onDelete={handleDeletePermissionUser} onRoleChange={handleRoleChangePermissionUser} />
                </UserListInner>
              </UserListScrollArea>
            </StyledTabsContent>
          ))}
        </StyledTabs>
      </PermissionsInner>
    </PermissionsRoot>
  )
}

const PermissionsRoot = styled.div`
  flex: 1;
  min-height: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`

const PermissionsInner = styled.div`
  flex: 1;
  min-height: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 600px;
`

const StyledTabs = styled(Tabs)`
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
`

const UserListScrollArea = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
  direction: ltr;
  padding-inline-end: 8px;
`

const UserListInner = styled.div`
  direction: rtl;
`

const Subtitle = styled.p`
  font-size: 0.75rem;
  color: var(--sea-ink-soft);
  margin: 0;
`

const StyledTabsList = styled(TabsList)`
  align-self: flex-end;
  direction: rtl;
`

const StyledTabsContent = styled(TabsContent)`
  flex: 1;
  min-height: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`

const SearchSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
`