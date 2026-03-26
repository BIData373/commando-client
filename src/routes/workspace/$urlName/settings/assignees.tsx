import styled from '@emotion/styled'
import { createFileRoute } from '@tanstack/react-router'
import { Info, Plus, Search } from 'lucide-react'
import { type ChangeEvent, useState } from 'react'
import { AssigneeDialog } from '#/components/settings/AssigneeDialog'
import { FAKE_USERS } from '#/components/settings/UsersPermissionList'
import { Avatar, AvatarFallback } from '../../../../components/ui/avatar'
import { Badge } from '../../../../components/ui/badge'
import { Button } from '../../../../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../components/ui/card'
import { Checkbox } from '../../../../components/ui/checkbox'
import { InputGroup, InputGroupAddon, InputGroupInput } from '../../../../components/ui/input-group'
import { Separator } from '../../../../components/ui/separator'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../../../components/ui/tooltip'

export const Route = createFileRoute('/workspace/$urlName/settings/assignees')({ component: SettingsAssignees })

interface MetaFields {
  id: number
  createdAt: Date
  createdBy: number
  updatedAt: Date
  updatedBy: number
  deletedAt: Date | null
  deletedBy: number | null
}

interface AssigneeTaskStatus {
  taskId: number
  assigneeId: number
  statusId: number
}

interface Assignee extends MetaFields {
  name: string
  color: string
  userIds?: number[]
  taskStatuses?: AssigneeTaskStatus[]
}

const FAKE_USER_NAMES: Record<number, string> = {
  1: 'אבי כהן',
  2: 'מיכל לוי',
  3: 'יוסי גולן',
  4: 'רחל מזרחי',
  5: 'דוד פרץ',
  6: 'נועה ברקוביץ',
  7: 'אורן שפירא',
  8: 'תמר אבידן',
  9: 'גיל נחמן',
  10: 'שרה ויסמן',
  11: 'בנימין חזן',
  12: 'דינה אורן',
}

const MOCK_ASSIGNEES: Assignee[] = [
  {
    id: 1,
    name: 'מחלקת מבצעים',
    color: '#3B82F6',
    userIds: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    createdAt: new Date('2026-01-01'),
    createdBy: 1,
    updatedAt: new Date('2026-01-01'),
    updatedBy: 1,
    deletedAt: null,
    deletedBy: null,
  },
  {
    id: 2,
    name: 'צוות לוגיסטיקה',
    color: '#10B981',
    userIds: [3, 5, 7, 10, 11],
    createdAt: new Date('2026-01-01'),
    createdBy: 1,
    updatedAt: new Date('2026-01-01'),
    updatedBy: 1,
    deletedAt: null,
    deletedBy: null,
  },
  {
    id: 3,
    name: 'קצינת מודיעין',
    color: '#F59E0B',
    userIds: [4],
    createdAt: new Date('2026-01-01'),
    createdBy: 1,
    updatedAt: new Date('2026-01-01'),
    updatedBy: 1,
    deletedAt: null,
    deletedBy: null,
  },
  {
    id: 4,
    name: "פלוגה א'",
    color: '#EF4444',
    userIds: [1, 2, 6, 8, 9, 10, 11, 12],
    createdAt: new Date('2026-01-01'),
    createdBy: 1,
    updatedAt: new Date('2026-01-01'),
    updatedBy: 1,
    deletedAt: null,
    deletedBy: null,
  },
  {
    id: 5,
    name: 'קצין קשר',
    color: '#8B5CF6',
    userIds: [7, 9],
    createdAt: new Date('2026-01-01'),
    createdBy: 1,
    updatedAt: new Date('2026-01-01'),
    updatedBy: 1,
    deletedAt: null,
    deletedBy: null,
  },
  {
    id: 6,
    name: 'מפקדת הגדוד',
    color: '#EC4899',
    userIds: [2, 4, 6, 12],
    createdAt: new Date('2026-01-01'),
    createdBy: 1,
    updatedAt: new Date('2026-01-01'),
    updatedBy: 1,
    deletedAt: null,
    deletedBy: null,
  },
]

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
  const [isUpdateCardOpen, setIsUpdateCardOpen] = useState(false)

  function onCardClick() {
    setIsUpdateCardOpen(true)
  }

  return (
    <>
      <AssigneeDialog
        assignee={{ name: assignee.name, color: assignee.color }}
        assignees={FAKE_USERS.filter(user => userIds.includes(user.id))}
        open={isUpdateCardOpen}
        onOpenChange={setIsUpdateCardOpen}
      />
      <Card onClick={onCardClick}>
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
    </>
  )
}

function SettingsAssignees() {
  const [allowAssigneeStatusUpdate, setAllowAssigneeStatusUpdate] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

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
      <ToolbarRow>
        <SearchWrapper>
          <InputGroup>
            <InputGroupAddon align="inline-start">
              <Search size={16} />
            </InputGroupAddon>
            <InputGroupInput value={searchQuery} onChange={handleSearchChange} placeholder="חפש קבוצת אחראים" />
          </InputGroup>
        </SearchWrapper>
        <Button variant="default" onClick={handleOpenCreateDialog}>
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

const ColoredFallback = styled(AvatarFallback) <{ $color: string }>`
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