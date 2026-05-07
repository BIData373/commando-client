import styled from '@emotion/styled'
import { createFileRoute } from '@tanstack/react-router'
import { Info, Plus, Search } from 'lucide-react'
import { type ChangeEvent, useState } from 'react'
import { AssigneeCard } from '#/components/settings/AssigneeCard'
import { AssigneeDialog } from '#/components/settings/AssigneeDialog'
import { SectionTitle } from '#/components/settings/SectionTitle'
import { Button } from '#/components/ui/button'
import { Checkbox } from '#/components/ui/checkbox'
import { InputGroup, InputGroupAddon, InputGroupInput } from '#/components/ui/input-group'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '#/components/ui/tooltip'
import { useAssignees } from '#/hooks/useAssignees'
import { useUsers } from '#/hooks/useUsers'
import { SETTINGS_TABS, SettingTabPath } from '#/utils/settingsUtils'

export const Route = createFileRoute('/workspace/$urlName/settings/assignees')({ component: SettingsAssignees })

const activeTab = SETTINGS_TABS[SettingTabPath.ASSIGNEES]

function SettingsAssignees() {
  const [allowAssigneeStatusUpdate, setAllowAssigneeStatusUpdate] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  const { data: assignees = [] } = useAssignees()
  const { data: users = [] } = useUsers()

  const userNames: Record<number, string> = Object.fromEntries(users.map((u) => [u.id, u.name]))

  const filteredAssignees = searchQuery.trim()
    ? assignees.filter((a) => a.name.includes(searchQuery))
    : assignees

  function handleCheckboxChange(checked: boolean) {
    setAllowAssigneeStatusUpdate(checked)
  }

  function handleSearchChange(e: ChangeEvent<HTMLInputElement>) {
    setSearchQuery(e.target.value)
  }

  function handleOpenCreateDialog() {
    setIsCreateDialogOpen(true)
  }

  return (
    <AssigneesRoot>
      <AssigneeDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      />
      <StyledSectionTitle title={`ניהול אחראים - ${activeTab}`} />
      <StyledContent>
        <CheckboxRow>
          <Checkbox
            id="allow-status-update"
            checked={allowAssigneeStatusUpdate}
            onCheckedChange={handleCheckboxChange}
          />
          <CheckboxLabel htmlFor="allow-status-update">
            אפשר לאחראיים לעדכן סטטוס הנחיות
          </CheckboxLabel>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <InfoIcon>
                  <Info size={16} />
                </InfoIcon>
              </TooltipTrigger>
              <StyledTooltipContent>
                מאפשר לאחראים שקיבלו את ההנחיה לעדכן את הסטטוס שלה. אם האפשרות כבויה – עדכון הסטטוס יתאפשר רק למנהלי הלשכה.
              </StyledTooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CheckboxRow>
        <ToolbarRow>
          <SearchWrapper>
            <StyledInputGroup>
              <InputGroupAddon align="inline-start">
                <Search size={16} />
              </InputGroupAddon>
              <InputGroupInput value={searchQuery} onChange={handleSearchChange} placeholder="חפש קבוצת אחראים" />
            </StyledInputGroup>
          </SearchWrapper>
          <StyledButton variant="default" onClick={handleOpenCreateDialog}>
            <Plus size={16} />
            צור אחראי
          </StyledButton>
        </ToolbarRow>
      </StyledContent>

      <CardScrollArea>
        <AssigneeCardGrid>
          {filteredAssignees.map((assignee) => (
            <AssigneeCard key={assignee.id} assignee={assignee} userNames={userNames} />
          ))}
        </AssigneeCardGrid>
      </CardScrollArea>
    </AssigneesRoot>
  )
}

const SearchWrapper = styled.div`
  max-width: 300px;
  flex: 1;
`

const ToolbarRow = styled.div`
  display: flex;
  align-items: center;
  margin-right: 20px;
  gap: 12px;
`

const StyledTooltipContent = styled(TooltipContent)`
  background: var(--background);
  color: var(--text-color-2);
`

const StyledContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const AssigneesRoot = styled.div`
  flex: 1;
  min-height: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const CardScrollArea = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
  direction: ltr;
  margin-block-start: 22px;
`

const StyledButton = styled(Button)`
  &:hover {
    cursor: pointer;
    opacity: 0.9;
  }
`

const CheckboxRow = styled.div`
  display: flex;
  align-items: center;
  margin-right: 20px;
  gap: 8px;
`

const CheckboxLabel = styled.label`
  font-size: 14px;
  font-weight: 400;
  color: var(--sea-ink);
  cursor: pointer;
`

const StyledInputGroup = styled(InputGroup)`
  background: var(--background);
`

const StyledSectionTitle = styled(SectionTitle)`
  margin-right: 20px;
`

const InfoIcon = styled.button`
  display: flex;
  align-items: center;
  background: none;
  border: none;
  padding: 0;
  color: var(--sea-ink-soft);
  cursor: pointer;

  &:hover {
    color: var(--sea-ink);
  }
`

const AssigneeCardGrid = styled.div`
  padding: 0 10px;
  /* display: grid; */
  display: flex;
  flex-wrap: wrap;
  flex: 1;
  gap: 18px;
  direction: rtl;
`