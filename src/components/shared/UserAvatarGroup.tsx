import styled from '@emotion/styled';
import type { IUserSummary } from '../../types';
import UserAvatar from './UserAvatar';

interface UserAvatarGroupProps {
  users: IUserSummary[];
  max?: number;
  size?: number;
}

export default function UserAvatarGroup({ users, max = 4, size = 32 }: UserAvatarGroupProps) {
  if (users.length === 0) return null;

  const visible = users.slice(0, max);
  const remaining = users.length - max;

  return (
    <Row>
      {remaining > 0 && <OverflowBadge $size={size}>+{remaining}</OverflowBadge>}
      {visible.reverse().map((user) => (
        <AvatarSlot key={user.id}>
          <UserAvatar user={user} size={size} />
        </AvatarSlot>
      ))}
    </Row>
  );
}

const Row = styled.div`
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
`;

const AvatarSlot = styled.div`
  margin-inline-end: -0.5rem;
  border: 2px solid var(--color-paper);
  border-radius: 9999px;
`;

const OverflowBadge = styled.div<{ $size: number }>`
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  font-size: ${({ $size }) => $size * 0.35}px;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  background-color: var(--color-gray-200);
  color: var(--color-text-secondary);
  border: 2px solid var(--color-paper);
  margin-inline-end: -0.5rem;
`;
