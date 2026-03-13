import styled from '@emotion/styled';

const AVATAR_COLORS = [
  '#3f51b5',
  '#7c4dff',
  '#e91e63',
  '#009688',
  '#ff5722',
  '#795548',
  '#607d8b',
  '#4caf50',
];

interface UserInitialsProps {
  name: string;
  size?: number;
}

export default function UserInitials({ name, size = 28 }: UserInitialsProps) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const bg = AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
  const parts = name.split(' ').filter(Boolean);
  const initials = parts.length >= 2 ? parts[0][0] + parts[1][0] : name.substring(0, 2);

  return (
    <Avatar $size={size} $bg={bg}>
      {initials}
    </Avatar>
  );
}

const Avatar = styled.div<{ $size: number; $bg: string }>`
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: ${({ $size }) => $size * 0.38}px;
  color: var(--color-paper);
  background-color: ${({ $bg }) => $bg};
  flex-shrink: 0;
`;
