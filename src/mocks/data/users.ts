import type { UserDto, UserSummaryDto } from '@/api/dtos';

export const mockUsers: UserDto[] = [
  {
    id: 'u1-aaaa-bbbb-cccc-dddddddddddd',
    email: 'yael@example.com',
    name: 'סא"ל כהן',
    avatar_url: null,
    role: 'admin',
    created_at: '2025-06-01T08:00:00Z',
    updated_at: '2026-02-10T12:00:00Z',
    last_login: '2026-02-18T09:30:00Z',
  },
  {
    id: 'u2-aaaa-bbbb-cccc-dddddddddddd',
    email: 'avi@example.com',
    name: 'רס"ן לוי',
    avatar_url: null,
    role: 'user',
    created_at: '2025-07-15T08:00:00Z',
    updated_at: '2026-02-15T10:00:00Z',
    last_login: '2026-02-17T14:00:00Z',
  },
  {
    id: 'u3-aaaa-bbbb-cccc-dddddddddddd',
    email: 'dana@example.com',
    name: 'סרן מזרחי',
    avatar_url: null,
    role: 'user',
    created_at: '2025-08-01T08:00:00Z',
    updated_at: '2026-01-20T10:00:00Z',
    last_login: '2026-02-16T11:00:00Z',
  },
  {
    id: 'u4-aaaa-bbbb-cccc-dddddddddddd',
    email: 'moshe@example.com',
    name: 'רב"ט ישראלי',
    avatar_url: null,
    role: 'user',
    created_at: '2025-09-10T08:00:00Z',
    updated_at: '2026-02-01T10:00:00Z',
    last_login: '2026-02-18T08:00:00Z',
  },
  {
    id: 'u5-aaaa-bbbb-cccc-dddddddddddd',
    email: 'noa@example.com',
    name: 'סמ"ר ברק',
    avatar_url: null,
    role: 'user',
    created_at: '2025-10-01T08:00:00Z',
    updated_at: '2026-02-12T10:00:00Z',
    last_login: '2026-02-17T16:00:00Z',
  },
];

/** Current logged-in user (for mock purposes) */
export const currentUser: UserSummaryDto = {
  id: mockUsers[0].id,
  name: mockUsers[0].name,
  avatar_url: mockUsers[0].avatar_url,
};

export const mockUserSummaries: UserSummaryDto[] = mockUsers.map((u) => ({
  id: u.id,
  name: u.name,
  avatar_url: u.avatar_url,
}));
