import { UserAvatar } from './UserAvatar';
import type { UserSummary } from '@/types';

interface UserAvatarGroupProps {
  users: UserSummary[];
  max?: number;
  size?: number;
}

export function UserAvatarGroup({ users, max = 4, size = 32 }: UserAvatarGroupProps) {
  if (users.length === 0) return null;

  const visible = users.slice(0, max);
  const remaining = users.length - max;

  return (
    <div className="flex flex-row-reverse items-center">
      {remaining > 0 && (
        <div
          className="rounded-full flex items-center justify-center font-semibold bg-gray-200 text-text-secondary border-2 border-white -me-2"
          style={{ width: size, height: size, fontSize: size * 0.35 }}
        >
          +{remaining}
        </div>
      )}
      {visible.reverse().map((user) => (
        <div key={user.id} className="-me-2 border-2 border-white rounded-full">
          <UserAvatar user={user} size={size} />
        </div>
      ))}
    </div>
  );
}
