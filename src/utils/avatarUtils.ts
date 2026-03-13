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

/** Generates a consistent color from a string. */
export function stringToColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

/** Gets initials from a name (supports Hebrew multi-word names). */
export function getInitials(name: string): string {
  const parts = name.split(' ').filter(Boolean);
  if (parts.length >= 2) {
    return parts[0][0] + parts[1][0];
  }
  return name.substring(0, 2);
}
