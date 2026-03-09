import { Tooltip } from '@/components/ui';
import type { UserSummary } from '@/types';

interface UserAvatarProps {
  user: UserSummary;
  size?: number;
}

/** Generates a consistent color from a string */
function stringToColor(str: string): string {
  const colors = [
    '#3f51b5', '#7c4dff', '#e91e63', '#009688',
    '#ff5722', '#795548', '#607d8b', '#4caf50',
    '#ff9800', '#2196f3',
  ];
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

/** Gets initials from a Hebrew name */
function getInitials(name: string): string {
  const parts = name.split(' ').filter(Boolean);
  if (parts.length >= 2) {
    return parts[0][0] + parts[1][0];
  }
  return name.substring(0, 2);
}

export function UserAvatar({ user, size = 36 }: UserAvatarProps) {
  const avatar = user.avatarUrl ? (
    <img
      src={user.avatarUrl}
      alt={user.name}
      className="rounded-full object-cover"
      style={{ width: size, height: size }}
    />
  ) : (
    <div
      className="rounded-full flex items-center justify-center font-semibold text-white shrink-0"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.4,
        backgroundColor: stringToColor(user.name),
      }}
      aria-label={user.name}
    >
      {getInitials(user.name)}
    </div>
  );

  return <Tooltip content={user.name}>{avatar}</Tooltip>;
}
