import type { IActivityEvent } from '../../types';
import { mockUserSummaries } from './users';

export const mockActivity: IActivityEvent[] = [
  // Activity for instruction 1
  {
    id: 'act-01-aaaa-bbbb-cccccccccccc',
    instructionId: 'inst-01-aaaa-bbbb-cccccccccccc',
    user: mockUserSummaries[0],
    action: 'created',
    metadata: {},
    createdAt: '2026-01-05T08:00:00Z',
  },
  {
    id: 'act-02-aaaa-bbbb-cccccccccccc',
    instructionId: 'inst-01-aaaa-bbbb-cccccccccccc',
    user: mockUserSummaries[0],
    action: 'assigned',
    metadata: { targetUser: mockUserSummaries[1] },
    createdAt: '2026-01-05T08:01:00Z',
  },
  {
    id: 'act-03-aaaa-bbbb-cccccccccccc',
    instructionId: 'inst-01-aaaa-bbbb-cccccccccccc',
    user: mockUserSummaries[0],
    action: 'assigned',
    metadata: { targetUser: mockUserSummaries[2] },
    createdAt: '2026-01-05T08:02:00Z',
  },
  {
    id: 'act-04-aaaa-bbbb-cccccccccccc',
    instructionId: 'inst-01-aaaa-bbbb-cccccccccccc',
    user: mockUserSummaries[1],
    action: 'status_changed',
    metadata: { oldValue: 'ממתין לביצוע', newValue: 'בביצוע' },
    createdAt: '2026-01-10T09:00:00Z',
  },
  {
    id: 'act-05-aaaa-bbbb-cccccccccccc',
    instructionId: 'inst-01-aaaa-bbbb-cccccccccccc',
    user: mockUserSummaries[1],
    action: 'commented',
    metadata: {
      commentPreview: 'קיבלתי את הנתונים ממדור הכספים...',
    },
    createdAt: '2026-01-10T09:00:00Z',
  },
  {
    id: 'act-06-aaaa-bbbb-cccccccccccc',
    instructionId: 'inst-01-aaaa-bbbb-cccccccccccc',
    user: mockUserSummaries[0],
    action: 'tag_added',
    metadata: { tagName: 'תקציב' },
    createdAt: '2026-01-05T08:03:00Z',
  },
  // Activity for instruction 2
  {
    id: 'act-07-aaaa-bbbb-cccccccccccc',
    instructionId: 'inst-02-aaaa-bbbb-cccccccccccc',
    user: mockUserSummaries[0],
    action: 'created',
    metadata: {},
    createdAt: '2026-01-15T08:00:00Z',
  },
  {
    id: 'act-08-aaaa-bbbb-cccccccccccc',
    instructionId: 'inst-02-aaaa-bbbb-cccccccccccc',
    user: mockUserSummaries[0],
    action: 'priority_changed',
    metadata: { oldValue: 'שגרתית', newValue: 'מבצעי' },
    createdAt: '2026-02-10T10:00:00Z',
  },
  // Activity for instruction 8 (overdue)
  {
    id: 'act-09-aaaa-bbbb-cccccccccccc',
    instructionId: 'inst-08-aaaa-bbbb-cccccccccccc',
    user: mockUserSummaries[1],
    action: 'created',
    metadata: {},
    createdAt: '2026-02-01T08:00:00Z',
  },
  {
    id: 'act-10-aaaa-bbbb-cccccccccccc',
    instructionId: 'inst-08-aaaa-bbbb-cccccccccccc',
    user: mockUserSummaries[3],
    action: 'status_changed',
    metadata: { oldValue: 'ממתין לביצוע', newValue: 'בביצוע' },
    createdAt: '2026-02-03T09:00:00Z',
  },
];
