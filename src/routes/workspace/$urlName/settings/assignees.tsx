import styled from '@emotion/styled'
import { createFileRoute } from '@tanstack/react-router'
import { CircleQuestionMarkIcon, Plus, Search } from 'lucide-react'
import { type ChangeEvent, useState } from 'react'
import { AssigneeCard } from '#/components/settings/AssigneeCard'
import { AssigneeDialog } from '#/components/settings/AssigneeDialog'
import { SectionTitle } from '#/components/settings/SectionTitle'
import { PrimaryButton } from '#/components/shared/PrimaryButton'
import { Checkbox } from '#/components/ui/checkbox'
import { InputGroup, InputGroupAddon, InputGroupInput } from '#/components/ui/input-group'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '#/components/ui/tooltip'
import { useWorkspace } from '#/providers/WorkspaceProvider'
import { SETTINGS_TABS, SettingTabPath } from '#/utils/settingsUtils'
import styled from '@emotion/styled'
import { createFileRoute } from '@tanstack/react-router'
import { CircleQuestionMarkIcon, Plus, Search } from 'lucide-react'
import { type ChangeEvent, useState } from 'react'
import { useListAssignees } from '#/api/assignee/assignee'
import { useListUsers } from '#/api/user/user'

export const Route = createFileRoute('/workspace/$urlName/settings/assignees')({ component: SettingsAssignees })

const activeTab = SETTINGS_TABS[SettingTabPath.ASSIGNEES]

function SettingsAssignees() {
  const { workspaceId, assigneeStatusEditable } = useWorkspace()

  const { data: assignees = [] } = useListAssignees({ workspaceId })
  const { data: users = [] } = useListUsers()

  const [allowAssigneeStatusUpdate, setAllowAssigneeStatusUpdate] = useState(assigneeStatusEditable)
  const [searchQuery, setSearchQuery] = useState('')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  const userNames: Record<number, string> = Object.fromEntries(users.map((u) => [u.id, u.upn]))

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
      <SectionTitle title={`ניהול אחראים - ${activeTab}`} />
      <StyledContent>
        <CheckboxRow>
          <Checkbox
            id="allow-status-update"
            checked={allowAssigneeStatusUpdate}
            defaultChecked={assigneeStatusEditable}
            onCheckedChange={handleCheckboxChange}
          />
          <CheckboxLabel htmlFor="allow-status-update">
            אפשר לאחראיים לעדכן סטטוס הנחיות
          </CheckboxLabel>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <QuestionIcon>
                  <CircleQuestionMarkIcon size={16} />
                </QuestionIcon>
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
          <PrimaryButton
            title='צור אחרי'
            onClick={handleOpenCreateDialog}
            header={<Plus size={16} />}
            height={32}
          />
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
  margin-right: 12px;
  gap: 12px;
`

const StyledTooltipContent = styled(TooltipContent)`
  background: var(--background);
  color: var(--text-color-2);

  svg {
    opacity: 0;
  } 
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
`

const CheckboxRow = styled.div`
  display: flex;
  align-items: center;
  margin-right: 12px;
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

const QuestionIcon = styled.button`
  display: flex;
  align-items: center;
  background: none;
  border: none;
  padding: 0;
  color: rgba(0, 0, 0, 0.25);
  cursor: pointer;
`

const AssigneeCardGrid = styled.div`
  padding: 20px 10px;
  display: flex;
  flex-wrap: wrap;
  flex: 1;
  gap: 18px;
  direction: rtl;
`