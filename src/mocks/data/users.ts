import type { IUser, IUserSummary } from '../../types';

export const mockUsers: IUser[] = [
    {
        id: 1,
        email: 'yael@example.com',
        name: 'סא"ל כהן',
        avatarUrl: null,
        role: 'admin',
        createdAt: '2025-06-01T08:00:00Z',
        updatedAt: '2026-02-10T12:00:00Z',
        lastLogin: '2026-02-18T09:30:00Z',
    },
    {
        id: 2,
        email: 'avi@example.com',
        name: 'רס"ן לוי',
        avatarUrl: null,
        role: 'user',
        createdAt: '2025-07-15T08:00:00Z',
        updatedAt: '2026-02-15T10:00:00Z',
        lastLogin: '2026-02-17T14:00:00Z',
    },
    {
        id: 3,
        email: 'dana@example.com',
        name: 'סרן מזרחי',
        avatarUrl: null,
        role: 'user',
        createdAt: '2025-08-01T08:00:00Z',
        updatedAt: '2026-01-20T10:00:00Z',
        lastLogin: '2026-02-16T11:00:00Z',
    },
    {
        id: 4,
        email: 'moshe@example.com',
        name: 'רב"ט ישראלי',
        avatarUrl: null,
        role: 'user',
        createdAt: '2025-09-10T08:00:00Z',
        updatedAt: '2026-02-01T10:00:00Z',
        lastLogin: '2026-02-18T08:00:00Z',
    },
    {
        id: 5,
        email: 'noa@example.com',
        name: 'סמ"ר ברק',
        avatarUrl: null,
        role: 'user',
        createdAt: '2025-10-01T08:00:00Z',
        updatedAt: '2026-02-12T10:00:00Z',
        lastLogin: '2026-02-17T16:00:00Z',
    },
];

/** Current logged-in user (for mock purposes) */
export const currentUser: IUserSummary = {
    id: mockUsers[0].id,
    name: mockUsers[0].name,
    avatarUrl: mockUsers[0].avatarUrl,
};

export const mockUserSummaries: IUserSummary[] = mockUsers.map((u) => ({
    id: u.id,
    name: u.name,
    avatarUrl: u.avatarUrl,
}));
