import styled from '@emotion/styled';
import type { IUserSummary } from '../../types';
import Tooltip from './Tooltip';

const AVATAR_COLORS = [
  '#3f51b5',
  '#7c4dff',
  '#e91e63',
  '#009688',
  '#ff5722',
  '#795548',
  '#607d8b',
  '#4caf50',
  '#ff9800',
  '#2196f3',
];

function stringToColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function getInitials(name: string): string {
  const parts = name.split(' ').filter(Boolean);
  if (parts.length >= 2) return parts[0][0] + parts[1][0];
  return name.substring(0, 2);
}

interface UserAvatarProps {
  user: IUserSummary;
  size?: number;
}

export default function UserAvatar({ user, size = 36 }: UserAvatarProps) {
  return (
    <Tooltip content={user.name}>
      {user.avatarUrl ? (
        <AvatarImg src={user.avatarUrl} alt={user.name} $size={size} />
      ) : (
        <AvatarFallback $size={size} $bg={stringToColor(user.name)} aria-label={user.name}>
          {getInitials(user.name)}
        </AvatarFallback>
      )}
    </Tooltip>
  );
}

const AvatarImg = styled.img<{ $size: number }>`
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  border-radius: 9999px;
  object-fit: cover;
`;

const AvatarFallback = styled.div<{ $size: number; $bg: string }>`
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  font-size: ${({ $size }) => $size * 0.4}px;
  background-color: ${({ $bg }) => $bg};
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: var(--color-paper);
  flex-shrink: 0;
`;
