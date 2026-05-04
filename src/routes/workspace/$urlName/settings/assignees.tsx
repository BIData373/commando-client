import styled from '@emotion/styled'
import { createFileRoute } from '@tanstack/react-router'
import { useState, type ChangeEvent } from 'react'
import { Avatar, AvatarFallback } from '../../../../components/ui/avatar'
import { Badge } from '../../../../components/ui/badge'
import { Button } from '../../../../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../components/ui/card'
import { Checkbox } from '../../../../components/ui/checkbox'
import { InputGroup, InputGroupAddon, InputGroupInput } from '../../../../components/ui/input-group'
import { Separator } from '../../../../components/ui/separator'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../../../components/ui/tooltip'
import { Info, Plus, Search } from 'lucide-react'
import { FAKE_USER_NAMES, MOCK_SETTINGS_ASSIGNEES as MOCK_ASSIGNEES, type SettingsAssignee as Assignee } from '../../../../data/Assignees'

export const Route = createFileRoute('/workspace/$urlName/settings/assignees')({ component: SettingsAssignees })


const MAX_VISIBLE_TAGS = 3

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
}

interface AssigneeCardProps {
  assignee: Assignee
}

function AssigneeCard({ assignee }: AssigneeCardProps) {
  const userIds = assignee.userIds ?? []
  const visibleIds = userIds.slice(0, MAX_VISIBLE_TAGS)
  const remaining = userIds.length - MAX_VISIBLE_TAGS

  return (
    <Card>
      <CardHeader>
        {/* Flex row: Avatar is first in DOM = inline-start (RIGHT in RTL) */}
        <CardHeaderRow>
          <Avatar>
            <ColoredFallback $color={assignee.color}>{getInitials(assignee.name)}</ColoredFallback>
          </Avatar>
          <CardMeta>
            <CardTitle>{assignee.name}</CardTitle>
            <CardDescription>{userIds.length} משתמשים</CardDescription>
          </CardMeta>
        </CardHeaderRow>
      </CardHeader>
      <CardContent>
        <Separator />
        <TagRow>
          {visibleIds.map((uid) => (
            <Badge key={uid} variant="secondary">
              {FAKE_USER_NAMES[uid] ?? `#${uid}`}
            </Badge>
          ))}
          {remaining > 0 && <Badge variant="outline">+{remaining}</Badge>}
        </TagRow>
      </CardContent>
    </Card>
  )
}

function SettingsAssignees() {
  const [allowAssigneeStatusUpdate, setAllowAssigneeStatusUpdate] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  function handleCheckboxChange(checked: boolean) {
    setAllowAssigneeStatusUpdate(checked)
  }

  function handleSearchChange(e: ChangeEvent<HTMLInputElement>) {
    setSearchQuery(e.target.value)
  }

  return (
    <AssigneesRoot>
      <ToolbarRow>
        <SearchWrapper>
          <InputGroup>
            <InputGroupAddon align="inline-start">
              <Search size={16} />
            </InputGroupAddon>
            <InputGroupInput value={searchQuery} onChange={handleSearchChange} placeholder="חפש קבוצת אחראים" />
          </InputGroup>
        </SearchWrapper>
        <Button variant="default">
          <Plus size={16} />
          צור אחראי
        </Button>
      </ToolbarRow>
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
            <TooltipContent>
              מאפשר לאחראים שקיבלו את ההנחיה לעדכן את הסטטוס שלה. אם האפשרות כבויה – עדכון הסטטוס יתאפשר רק למנהלי הלשכה.
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CheckboxRow>

      <AssigneeCardGrid>
        {MOCK_ASSIGNEES.map((assignee) => (
          <AssigneeCard key={assignee.id} assignee={assignee} />
        ))}
      </AssigneeCardGrid>
    </AssigneesRoot>
  )
}

const SearchWrapper = styled.div`
  flex: 1;
`

const ToolbarRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`

const AssigneesRoot = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`

const CheckboxRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

const CheckboxLabel = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: var(--sea-ink);
  cursor: pointer;
`

const InfoIcon = styled.button`
  display: flex;
  align-items: center;
  color: var(--sea-ink-soft);
  cursor: pointer;

  &:hover {
    color: var(--sea-ink);
  }
`

const AssigneeCardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 16px;
`

const CardHeaderRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`

const CardMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`

const ColoredFallback = styled(AvatarFallback)<{ $color: string }>`
  background: ${({ $color }) => $color};
  color: white;
  font-size: 11px;
  font-weight: 700;
`

const TagRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding-block-start: 12px;
`
