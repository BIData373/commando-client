import styled from '@emotion/styled'
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Input } from '../../../../components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../../components/ui/tabs'

export const Route = createFileRoute('/workspace/$urlName/settings/permissions')({ component: SettingsPermissions })

type PermissionsTab = 'all' | 'admins' | 'viewers'

function SettingsPermissions() {
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState<PermissionsTab>('all')

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearch(e.target.value)
  }

  function handleTabChange(value: string) {
    setActiveTab(value as PermissionsTab)
  }

  return (
    <PermissionsRoot>
      <Subtitle>מנהל סביבה יוצר הנחיות, מגדיר אחראיים ומבצע בקרה ומעקב אחר סטטוס ההנחיות בסביבה</Subtitle>
      <Input
        value={search}
        onChange={handleSearchChange}
        placeholder="חפש שם/ תפקיד/ מספר אישי"
      />
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList variant="line">
          <TabsTrigger value="all">כולם</TabsTrigger>
          <TabsTrigger value="admins">מנהלים</TabsTrigger>
          <TabsTrigger value="viewers">צופים</TabsTrigger>
        </TabsList>
        <TabsContent value="all" />
        <TabsContent value="admins" />
        <TabsContent value="viewers" />
      </Tabs>
    </PermissionsRoot>
  )
}

const PermissionsRoot = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`

const Subtitle = styled.p`
  font-size: 14px;
  color: var(--sea-ink-soft);
  margin: 0;
`
