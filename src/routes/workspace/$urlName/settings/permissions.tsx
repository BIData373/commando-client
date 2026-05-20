import styled from '@emotion/styled'
import { createFileRoute } from '@tanstack/react-router'
import { UserPlus } from 'lucide-react'
import { useMemo, useState } from 'react'
import { DropdownPermission } from '#/components/settings/DropdownPermission'
import { DropdownUsers } from '#/components/settings/DropdownUsers'
import { SectionTitle } from '#/components/settings/SectionTitle'
import { UserPermissionList } from '#/components/settings/UserPermissionList'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '#/components/ui/tabs'
import { useAddUserToWorkspace, useDeleteUser, useUpdateUser, useWorkspaceUsers } from '#/hooks/useUsers'
import type { IUser } from '#/types'
import { UserRole } from '#/types'
import { SETTINGS_TABS, SettingTabPath } from '#/utils/settingsUtils'
import { concatName } from '#/utils/userUtils'

export const Route = createFileRoute('/workspace/$urlName/settings/permissions')({ component: SettingsPermissions })

const activeTabLabel = SETTINGS_TABS[SettingTabPath.PERMISSIONS]

enum PermissionsTab {
  ALL = 'all',
  ADMINS = 'admins',
  VIEWERS = 'viewers'
}

function SettingsPermissions() {
  const { urlName } = Route.useParams()
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState(PermissionsTab.ALL)
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null)
  const [role, setRole] = useState<UserRole>(UserRole.VIEWER);

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
    if (user) {
      setSearch(concatName(user))
    }
  }

  function handleSearchClear() {
    setSearch('')
    setSelectedUser(null)
  }

  return (
    <PermissionsRoot>
      <SectionTitle title={activeTabLabel} />
      <PermissionsInner>
        <Subtitle>מנהל סביבה יוצר הנחיות, מגדיר אחראיים ומבצע בקרה ומעקב אחר סטטוס ההנחיות בסביבה</Subtitle>
        <SearchSection>
          <DropdownUsers
            value={search}
            onChange={handleSearchChange}
            onSelect={handleSearchSelect}
            onClear={handleSearchClear}
            placeholder='חפש שם/ תפקיד/ מספר אישי'
          />
          <AddUserRow>
            {search.length > 0 && (
              <DropdownPermission
                ghost
                value={role}
                onChange={setRole}
                disabled={!selectedUser}
              />
            )}
            {selectedUser && (
              <AddAvatarButton onClick={() => handleUserAdd(role)} >
                <UserPlus size={16} />
              </AddAvatarButton>
            )}
          </AddUserRow>
        </SearchSection>
        <StyledTabs value={activeTab} onValueChange={handleTabChange}>
          <StyledTabsList variant="line">
            <StyledTabsTrigger value={PermissionsTab.ALL}>כולם</StyledTabsTrigger>
            <StyledTabsTrigger value={PermissionsTab.ADMINS}>מנהלים</StyledTabsTrigger>
            <StyledTabsTrigger value={PermissionsTab.VIEWERS}>צופים</StyledTabsTrigger>
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
  gap: 4px;
`

const PermissionsInner = styled.div`
  flex: 1;
  min-height: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 24px;
  max-width: 550px;
  padding: 0 12px;
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
  border-radius: 8px;
  color: var(--color-primary-foreground);
  cursor: pointer;
  background: var(--gradient);
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
  font-size: 14px;
  font-weight: 400;
  color: var(--text-subtitle-color);
  margin: 0;
`

const StyledTabsList = styled(TabsList)`
  align-self: flex-end;
  direction: rtl;
  border-bottom: 1px solid var(--line);
  gap: 24px;
  `

const StyledTabsContent = styled(TabsContent)`
  flex: 1;
  min-height: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  `

const StyledTabsTrigger = styled(TabsTrigger)`
  color: var(--text-color-2);
  font-size: 14px;
  font-weight: 400;
  cursor: pointer;  

  &[data-state="active"] {
    color: var(--active-color);
  }
  
  &[data-state="active"]::after {
    background-color: var(--active-color);
  }
`

const SearchSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
`