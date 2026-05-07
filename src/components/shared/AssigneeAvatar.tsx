import styled from '@emotion/styled'
import type { IAssignee } from '#/types'
import { Avatar, AvatarFallback } from '../ui/avatar'

interface AssigneeAvatarProps {
    assignee: IAssignee
    size?: number
}

function getInitials(name: string): string {
    return name
        .split(' ')
        .map((part) => part[0])
        .join('')
        .slice(0, 2)
}

export const AssigneeAvatar = ({ assignee, size }: AssigneeAvatarProps) => {
    return (
        <Avatar>
            {assignee.emblem ? (
                <EmblemAvatarImg $size={size} src={assignee.emblem} alt={assignee.name} />
            ) : (
                <ColoredFallback $size={size} $color={assignee.color}>{getInitials(assignee.name)}</ColoredFallback>
            )}
        </Avatar>
    )
}

const ColoredFallback = styled(AvatarFallback) <{ $color: string | null, $size?: number }>`
  background: ${({ $color }) => $color ?? 'var(--chip-bg)'};
  color: white;
  font-size: 11px;
  font-weight: 700;
  width: ${({ $size }) => $size ? `${$size}px` : 'none'};
  height: ${({ $size }) => $size ? `${$size}px` : 'none'};
`

const EmblemAvatarImg = styled.img <{ $size?: number }>`
  width: ${({ $size }) => $size ? `${$size}px` : 'none'};
  height: ${({ $size }) => $size ? `${$size}px` : 'none'};
  object-fit: contain;
  border-radius: 50%;
`