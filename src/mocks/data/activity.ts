import type { ActivityEventDto } from '@/api/dtos';
import { mockUserSummaries } from './users';

export const mockActivity: ActivityEventDto[] = [
  // Activity for instruction 1
  {
    id: 'act-01-aaaa-bbbb-cccccccccccc',
    instruction_id: 'inst-01-aaaa-bbbb-cccccccccccc',
    user: mockUserSummaries[0],
    action: 'created',
    metadata: {},
    created_at: '2026-01-05T08:00:00Z',
  },
  {
    id: 'act-02-aaaa-bbbb-cccccccccccc',
    instruction_id: 'inst-01-aaaa-bbbb-cccccccccccc',
    user: mockUserSummaries[0],
    action: 'assigned',
    metadata: { target_user: mockUserSummaries[1] },
    created_at: '2026-01-05T08:01:00Z',
  },
  {
    id: 'act-03-aaaa-bbbb-cccccccccccc',
    instruction_id: 'inst-01-aaaa-bbbb-cccccccccccc',
    user: mockUserSummaries[0],
    action: 'assigned',
    metadata: { target_user: mockUserSummaries[2] },
    created_at: '2026-01-05T08:02:00Z',
  },
  {
    id: 'act-04-aaaa-bbbb-cccccccccccc',
    instruction_id: 'inst-01-aaaa-bbbb-cccccccccccc',
    user: mockUserSummaries[1],
    action: 'status_changed',
    metadata: { old_value: 'ממתין לביצוע', new_value: 'בביצוע' },
    created_at: '2026-01-10T09:00:00Z',
  },
  {
    id: 'act-05-aaaa-bbbb-cccccccccccc',
    instruction_id: 'inst-01-aaaa-bbbb-cccccccccccc',
    user: mockUserSummaries[1],
    action: 'commented',
    metadata: {
      comment_preview: 'קיבלתי את הנתונים ממדור הכספים...',
    },
    created_at: '2026-01-10T09:00:00Z',
  },
  {
    id: 'act-06-aaaa-bbbb-cccccccccccc',
    instruction_id: 'inst-01-aaaa-bbbb-cccccccccccc',
    user: mockUserSummaries[0],
    action: 'tag_added',
    metadata: { tag_name: 'תקציב' },
    created_at: '2026-01-05T08:03:00Z',
  },
  // Activity for instruction 2
  {
    id: 'act-07-aaaa-bbbb-cccccccccccc',
    instruction_id: 'inst-02-aaaa-bbbb-cccccccccccc',
    user: mockUserSummaries[0],
    action: 'created',
    metadata: {},
    created_at: '2026-01-15T08:00:00Z',
  },
  {
    id: 'act-08-aaaa-bbbb-cccccccccccc',
    instruction_id: 'inst-02-aaaa-bbbb-cccccccccccc',
    user: mockUserSummaries[0],
    action: 'priority_changed',
    metadata: { old_value: 'שגרתית', new_value: 'מבצעי' },
    created_at: '2026-02-10T10:00:00Z',
  },
  // Activity for instruction 8 (overdue)
  {
    id: 'act-09-aaaa-bbbb-cccccccccccc',
    instruction_id: 'inst-08-aaaa-bbbb-cccccccccccc',
    user: mockUserSummaries[1],
    action: 'created',
    metadata: {},
    created_at: '2026-02-01T08:00:00Z',
  },
  {
    id: 'act-10-aaaa-bbbb-cccccccccccc',
    instruction_id: 'inst-08-aaaa-bbbb-cccccccccccc',
    user: mockUserSummaries[3],
    action: 'status_changed',
    metadata: { old_value: 'ממתין לביצוע', new_value: 'בביצוע' },
    created_at: '2026-02-03T09:00:00Z',
  },
];
