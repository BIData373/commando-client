import styled from '@emotion/styled'
import { createFileRoute } from '@tanstack/react-router'
import { Search, X } from 'lucide-react'
import { useState } from 'react'
import { AddUserSection } from '#/components/settings/AddUserSection'
import { type RoleType } from '#/components/settings/SelectDropdownPermission'
import { FAKE_USERS, UserPermissionList } from '#/components/settings/UsersPermissionList'
import { InputGroup, InputGroupAddon, InputGroupInput } from '#/components/ui/input-group'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../../components/ui/tabs'

export const Route = createFileRoute('/workspace/$urlName/settings/permissions')({ component: SettingsPermissions })

type PermissionsTab = 'all' | 'admins' | 'viewers'



function SettingsPermissions() {
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState<PermissionsTab>('all')

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearch(e.target.value)
  }

  function handleUserAdd(role: RoleType) {
    const id = FAKE_USERS[FAKE_USERS.length - 1].id + 1;
    FAKE_USERS.push(
      {
        id,
        name: search,
        personalId: '00000000@idf.il',
        jobTitle: 'Some Job',
        role,
        unit: 'Some Unit'
      })
    setSearch('')
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
          <UserPermissionList users={FAKE_USERS} />
        </TabsContent>
        <TabsContent value="admins">
          <UserPermissionList users={FAKE_USERS.filter((u) => u.role === 'admin')} />
        </TabsContent>
        <TabsContent value="viewers">
          <UserPermissionList users={FAKE_USERS.filter((u) => u.role === 'viewer')} />
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