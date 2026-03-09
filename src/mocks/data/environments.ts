import type {
  EnvironmentWithRoleDto,
  EnvironmentMemberDto,
  TagDto,
  ResponsibleGroupDto,
} from '@/api/dtos';
import { mockUsers, mockUserSummaries } from './users';

export const mockTags: TagDto[] = [
  {
    id: 'tag-01-aaaa-bbbb-cccccccccccc',
    environment_id: 'env-01-aaaa-bbbb-cccccccccccc',
    name: 'תקציב',
    color: '#3b82f6',
    created_at: '2025-08-01T08:00:00Z',
  },
  {
    id: 'tag-02-aaaa-bbbb-cccccccccccc',
    environment_id: 'env-01-aaaa-bbbb-cccccccccccc',
    name: 'כ"א',
    color: '#8b5cf6',
    created_at: '2025-08-01T08:00:00Z',
  },
  {
    id: 'tag-03-aaaa-bbbb-cccccccccccc',
    environment_id: 'env-01-aaaa-bbbb-cccccccccccc',
    name: 'תקשו"ב',
    color: '#10b981',
    created_at: '2025-08-01T08:00:00Z',
  },
  {
    id: 'tag-04-aaaa-bbbb-cccccccccccc',
    environment_id: 'env-01-aaaa-bbbb-cccccccccccc',
    name: 'מבצעים',
    color: '#f59e0b',
    created_at: '2025-08-01T08:00:00Z',
  },
  {
    id: 'tag-05-aaaa-bbbb-cccccccccccc',
    environment_id: 'env-01-aaaa-bbbb-cccccccccccc',
    name: 'פקש"ש',
    color: '#ef4444',
    created_at: '2025-08-01T08:00:00Z',
  },
  {
    id: 'tag-06-aaaa-bbbb-cccccccccccc',
    environment_id: 'env-02-aaaa-bbbb-cccccccccccc',
    name: 'פיתוח',
    color: '#06b6d4',
    created_at: '2025-09-01T08:00:00Z',
  },
  {
    id: 'tag-07-aaaa-bbbb-cccccccccccc',
    environment_id: 'env-02-aaaa-bbbb-cccccccccccc',
    name: 'בקרה',
    color: '#d946ef',
    created_at: '2025-09-01T08:00:00Z',
  },
];

export const mockEnvironments: EnvironmentWithRoleDto[] = [
  {
    id: 'env-01-aaaa-bbbb-cccccccccccc',
    name: 'מפקדת חטיבה',
    description: 'מערך מפקדת החטיבה — ניהול הנחיות והחלטות מפקד',
    logo_url: null,
    created_by: mockUsers[0].id,
    created_at: '2025-06-15T08:00:00Z',
    updated_at: '2026-02-15T10:00:00Z',
    archived: false,
    member_count: 5,
    instruction_count: 12,
    current_user_role: 'manager',
  },
  {
    id: 'env-02-aaaa-bbbb-cccccccccccc',
    name: 'מערך תקשו"ב',
    description: 'מערך תקשו"ב — ניהול משימות טכניות ותחזוקת מערכות',
    logo_url: null,
    created_by: mockUsers[1].id,
    created_at: '2025-08-01T08:00:00Z',
    updated_at: '2026-02-10T10:00:00Z',
    archived: false,
    member_count: 3,
    instruction_count: 8,
    current_user_role: 'manager',
  },
  {
    id: 'env-03-aaaa-bbbb-cccccccccccc',
    name: 'מערך לוגיסטי',
    description: 'מערך לוגיסטי — ניהול אספקה, תחזוקה ושילוח',
    logo_url: null,
    created_by: mockUsers[2].id,
    created_at: '2025-09-01T08:00:00Z',
    updated_at: '2026-01-20T10:00:00Z',
    archived: false,
    member_count: 4,
    instruction_count: 5,
    current_user_role: 'responsible',
  },
];

export const mockMembers: EnvironmentMemberDto[] = [
  {
    id: 'mem-01-aaaa-bbbb-cccccccccccc',
    environment_id: 'env-01-aaaa-bbbb-cccccccccccc',
    user: mockUserSummaries[0],
    role: 'manager',
    joined_at: '2025-06-15T08:00:00Z',
  },
  {
    id: 'mem-02-aaaa-bbbb-cccccccccccc',
    environment_id: 'env-01-aaaa-bbbb-cccccccccccc',
    user: mockUserSummaries[1],
    role: 'manager',
    joined_at: '2025-07-01T08:00:00Z',
  },
  {
    id: 'mem-03-aaaa-bbbb-cccccccccccc',
    environment_id: 'env-01-aaaa-bbbb-cccccccccccc',
    user: mockUserSummaries[2],
    role: 'responsible',
    joined_at: '2025-07-15T08:00:00Z',
  },
  {
    id: 'mem-04-aaaa-bbbb-cccccccccccc',
    environment_id: 'env-01-aaaa-bbbb-cccccccccccc',
    user: mockUserSummaries[3],
    role: 'responsible',
    joined_at: '2025-08-01T08:00:00Z',
  },
  {
    id: 'mem-05-aaaa-bbbb-cccccccccccc',
    environment_id: 'env-01-aaaa-bbbb-cccccccccccc',
    user: mockUserSummaries[4],
    role: 'responsible',
    joined_at: '2025-08-15T08:00:00Z',
  },
];

export const mockResponsibleGroups: ResponsibleGroupDto[] = [
  {
    id: 'resp-01-aaaa-bbbb-cccccccccccc',
    environment_id: 'env-01-aaaa-bbbb-cccccccccccc',
    nickname: 'מג"ד',
    members: [mockUserSummaries[1], mockUserSummaries[2], mockUserSummaries[3]],
    created_at: '2025-07-01T08:00:00Z',
  },
  {
    id: 'resp-02-aaaa-bbbb-cccccccccccc',
    environment_id: 'env-01-aaaa-bbbb-cccccccccccc',
    nickname: 'קצין תקשוב',
    members: [mockUserSummaries[4]],
    created_at: '2025-07-15T08:00:00Z',
  },
  {
    id: 'resp-03-aaaa-bbbb-cccccccccccc',
    environment_id: 'env-02-aaaa-bbbb-cccccccccccc',
    nickname: 'צוות פיתוח',
    members: [mockUserSummaries[1], mockUserSummaries[4]],
    created_at: '2025-09-01T08:00:00Z',
  },
];
