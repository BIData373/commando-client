import styled from '@emotion/styled'
import { useState } from 'react'
import type { IAssignee } from '#/types'
import { Avatar, AvatarFallback } from '../ui/avatar'
import { Badge } from '../ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Separator } from '../ui/separator'
import { AssigneeDialog } from './AssigneeDialog'


const MAX_VISIBLE_TAGS = 3

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
            <Card onClick={onCardClick}>
                <CardHeader>
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
                                {userNames[uid] ?? `#${uid}`}
                            </Badge>
                        ))}
                        {remaining > 0 && <Badge variant="outline">+{remaining}</Badge>}
                    </TagRow>
                </CardContent>
            </Card>
        </>
    )
}

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
