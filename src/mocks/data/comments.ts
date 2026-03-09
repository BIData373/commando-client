import type { CommentDto } from '@/api/dtos';
import { mockUserSummaries } from './users';

export const mockComments: CommentDto[] = [
  // דיווחים להנחיה 1 (תקציב שנתי)
  {
    id: 'cmt-01-aaaa-bbbb-cccccccccccc',
    instruction_id: 'inst-01-aaaa-bbbb-cccccccccccc',
    user: mockUserSummaries[1],
    content:
      'קיבלתי את הנתונים ממדור הכספים. מתחיל לעבוד על הטיוטה הראשונה.',
    created_at: '2026-01-10T09:00:00Z',
    updated_at: '2026-01-10T09:00:00Z',
    edited: false,
  },
  {
    id: 'cmt-02-aaaa-bbbb-cccccccccccc',
    instruction_id: 'inst-01-aaaa-bbbb-cccccccccccc',
    user: mockUserSummaries[2],
    content:
      'סיימתי את החלק של תקציב המבצעים. מצורף לתיק המשותף. @רס"ן לוי — בדוק ואשר.',
    created_at: '2026-01-20T14:30:00Z',
    updated_at: '2026-01-20T14:30:00Z',
    edited: false,
  },
  {
    id: 'cmt-03-aaaa-bbbb-cccccccccccc',
    instruction_id: 'inst-01-aaaa-bbbb-cccccccccccc',
    user: mockUserSummaries[0],
    content:
      'מאושר. יש לתאם תדריך סופי עם ראש מדור הכספים לפני ההגשה. יש להכין תרחיש מינימלי ומרבי.',
    created_at: '2026-02-05T11:00:00Z',
    updated_at: '2026-02-05T11:15:00Z',
    edited: true,
  },
  // דיווחים להנחיה 2 (שיבוץ קצין תקשו"ב)
  {
    id: 'cmt-04-aaaa-bbbb-cccccccccccc',
    instruction_id: 'inst-02-aaaa-bbbb-cccccccccccc',
    user: mockUserSummaries[3],
    content: 'הגדרתי את דרישות התפקיד. מעלה לאישור המפקד.',
    created_at: '2026-01-18T10:00:00Z',
    updated_at: '2026-01-18T10:00:00Z',
    edited: false,
  },
  {
    id: 'cmt-05-aaaa-bbbb-cccccccccccc',
    instruction_id: 'inst-02-aaaa-bbbb-cccccccccccc',
    user: mockUserSummaries[0],
    content: 'אישרתי את הדרישות. אפשר להפיץ.',
    created_at: '2026-01-19T08:30:00Z',
    updated_at: '2026-01-19T08:30:00Z',
    edited: false,
  },
  {
    id: 'cmt-06-aaaa-bbbb-cccccccccccc',
    instruction_id: 'inst-02-aaaa-bbbb-cccccccccccc',
    user: mockUserSummaries[3],
    content:
      'הופץ ב-3 ערוצים. התקבלו 12 מועמדים. אבצע סינון ראשוני עד סוף השבוע.',
    created_at: '2026-02-01T16:00:00Z',
    updated_at: '2026-02-01T16:00:00Z',
    edited: false,
  },
  {
    id: 'cmt-07-aaaa-bbbb-cccccccccccc',
    instruction_id: 'inst-02-aaaa-bbbb-cccccccccccc',
    user: mockUserSummaries[3],
    content:
      'סוננו 4 מועמדים מתאימים. מתאם ועדת קבלה לשבוע הבא. תג"ב מתקרב — יש לזרז.',
    created_at: '2026-02-08T10:00:00Z',
    updated_at: '2026-02-08T10:00:00Z',
    edited: false,
  },
  {
    id: 'cmt-08-aaaa-bbbb-cccccccccccc',
    instruction_id: 'inst-02-aaaa-bbbb-cccccccccccc',
    user: mockUserSummaries[0],
    content: 'מאשר. דווח לי בסיום ועדת הקבלה.',
    created_at: '2026-02-08T11:00:00Z',
    updated_at: '2026-02-08T11:00:00Z',
    edited: false,
  },
  // דיווחים להנחיה 8 (שדרוג שרתים)
  {
    id: 'cmt-09-aaaa-bbbb-cccccccccccc',
    instruction_id: 'inst-08-aaaa-bbbb-cccccccccccc',
    user: mockUserSummaries[3],
    content:
      'לתשומת לב — תג"ב חלף! השרת הראשי בסיכון תפעולי. יש לסגור בדחיפות מבצעית.',
    created_at: '2026-02-16T09:00:00Z',
    updated_at: '2026-02-16T09:00:00Z',
    edited: false,
  },
];
