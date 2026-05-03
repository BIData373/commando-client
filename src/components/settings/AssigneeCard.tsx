import styled from '@emotion/styled'
import { User } from 'lucide-react'
import { useState } from 'react'
import type { IAssignee } from '#/types'
import { Avatar, AvatarFallback } from '../ui/avatar'
import { Badge } from '../ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Separator } from '../ui/separator'
import { AssigneeDialog } from './AssigneeDialog'
import { DeleteAssigneePopconfirm } from './DeleteAssigneePopconfirm'


const MAX_VISIBLE_TAGS = 2

function getInitials(name: string): string {
    return name
        .split(' ')
        .map((part) => part[0])
        .join('')
        .slice(0, 2)
}

interface IAssigneeCardProps {
    assignee: IAssignee
    userNames: Record<number, string>
}


export function AssigneeCard({ assignee, userNames }: IAssigneeCardProps) {
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
                assignee={assignee}
                open={isUpdateCardOpen}
                onOpenChange={setIsUpdateCardOpen}
            />
            <StyledCard onClick={onCardClick}>
                <StyledCardHeader>
                    <CardHeaderRow>
                        <Avatar>
                            {assignee.emblem ? (
                                <EmblemAvatarImg src={assignee.emblem} alt={assignee.name} />
                            ) : (
                                <ColoredFallback $color={assignee.color}>{getInitials(assignee.name)}</ColoredFallback>
                            )}
                        </Avatar>
                        <CardWrapper>
                            <CardMeta>
                                <CardTitle>{assignee.name}</CardTitle>
                                <DeleteAssigneePopconfirm assigneeId={assignee.id} />
                            </CardMeta>
                            <StyledCardDescription>{userIds.length} משתמשים</StyledCardDescription>
                        </CardWrapper>
                    </CardHeaderRow>
                </StyledCardHeader>
                <CardContent>
                    <Separator />
                    <TagRow>
                        {visibleIds.map((uid) => (
                            <StyledBadge key={uid} variant="secondary">
                                <User size={16} />
                                {userNames[uid] ?? `#${uid}`}
                            </StyledBadge>
                        ))}
                        {remaining > 0 && <StyledBadge variant="outline">+{remaining}</StyledBadge>}
                    </TagRow>
                </CardContent>
            </StyledCard>
        </>
    )
}

const StyledCard = styled(Card)`
  border-radius: 6px;
  box-shadow: var(--card-shadow);
  gap: 8px;
`

const StyledCardHeader = styled(CardHeader)`
    padding: 0 8px;
`


const StyledCardDescription = styled(CardDescription)`
  color: #BFBFBF;
  font-size: 14px;
  font-weight: 400;
`

const CardHeaderRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 8px;
`

const CardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 12px;
`

const CardMeta = styled.div`
  display: flex;
  justify-content: space-between;
  flex: 1;
  gap: 4px;
`

const ColoredFallback = styled(AvatarFallback) <{ $color: string | null }>`
  background: ${({ $color }) => $color ?? 'var(--chip-bg)'};
  color: white;
  font-size: 11px;
  font-weight: 700;
`

const EmblemAvatarImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 50%;
`

const TagRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding-block-start: 12px;
`


const StyledBadge = styled(Badge)`
    border-radius: 9999px;
    font-size: 14px;
    padding: 0 7px;
    background: rgba(0, 0, 0, 0.04);
    font-weight: 400;
`