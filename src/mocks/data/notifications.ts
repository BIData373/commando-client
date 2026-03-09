export interface NotificationDto {
  id: string;
  type: 'new_instruction' | 'approaching_due' | 'overdue' | 'summary';
  title: string;
  body: string;
  read: boolean;
  instruction_id: string | null;
  environment_id: string | null;
  environment_name: string | null;
  created_at: string;
}

export interface NotificationPreferencesDto {
  new_instruction: boolean;
  approaching_due: boolean;
  approaching_due_days: number;
  overdue: boolean;
  summary_report: boolean;
  summary_frequency_days: number;
  summary_day_of_week: number;
  channel: 'chat' | 'email' | 'both';
}

export const mockNotifications: NotificationDto[] = [
  {
    id: 'notif-01',
    type: 'new_instruction',
    title: 'הנחיה חדשה שובצה אליך',
    body: 'הנחיה "הכנת תקציב שנתי לשנת 2026" במערך מפקדת חטיבה',
    read: false,
    instruction_id: 'inst-01-aaaa-bbbb-cccccccccccc',
    environment_id: 'env-01-aaaa-bbbb-cccccccccccc',
    environment_name: 'מפקדת חטיבה',
    created_at: '2026-02-28T14:30:00Z',
  },
  {
    id: 'notif-02',
    type: 'approaching_due',
    title: 'הנחיה מתקרבת לתג״ב',
    body: 'ההנחיה "בדיקת תקינות ציוד תקשוב" מתקרבת לתג״ב (בעוד 2 ימים)',
    read: false,
    instruction_id: 'inst-04-aaaa-bbbb-cccccccccccc',
    environment_id: 'env-02-aaaa-bbbb-cccccccccccc',
    environment_name: 'מערך תקשו"ב',
    created_at: '2026-02-28T10:00:00Z',
  },
  {
    id: 'notif-03',
    type: 'overdue',
    title: 'הנחיה חורגת מתג״ב!',
    body: 'ההנחיה "עדכון נהלי חירום" חורגת מתג״ב ב-3 ימים',
    read: false,
    instruction_id: 'inst-03-aaaa-bbbb-cccccccccccc',
    environment_id: 'env-01-aaaa-bbbb-cccccccccccc',
    environment_name: 'מפקדת חטיבה',
    created_at: '2026-02-27T16:00:00Z',
  },
  {
    id: 'notif-04',
    type: 'new_instruction',
    title: 'הנחיה חדשה שובצה אליך',
    body: 'הנחיה "תיאום ישיבת סגל שבועית" במערך מפקדת חטיבה',
    read: false,
    instruction_id: 'inst-07-aaaa-bbbb-cccccccccccc',
    environment_id: 'env-01-aaaa-bbbb-cccccccccccc',
    environment_name: 'מפקדת חטיבה',
    created_at: '2026-02-27T09:15:00Z',
  },
  {
    id: 'notif-05',
    type: 'approaching_due',
    title: 'הנחיה מתקרבת לתג״ב',
    body: 'ההנחיה "סקירת ביצועי מערכות" מתקרבת לתג״ב (בעוד 5 ימים)',
    read: true,
    instruction_id: 'inst-05-aaaa-bbbb-cccccccccccc',
    environment_id: 'env-02-aaaa-bbbb-cccccccccccc',
    environment_name: 'מערך תקשו"ב',
    created_at: '2026-02-26T11:00:00Z',
  },
  {
    id: 'notif-06',
    type: 'summary',
    title: 'סיכום שבועי',
    body: '3 הנחיות פתוחות, 2 בביצוע, 1 חורגת מתג״ב',
    read: true,
    instruction_id: null,
    environment_id: null,
    environment_name: null,
    created_at: '2026-02-25T08:00:00Z',
  },
  {
    id: 'notif-07',
    type: 'overdue',
    title: 'הנחיה חורגת מתג״ב!',
    body: 'ההנחיה "הגשת דוח מוכנות חודשי" חורגת מתג״ב ב-7 ימים',
    read: true,
    instruction_id: 'inst-10-aaaa-bbbb-cccccccccccc',
    environment_id: 'env-01-aaaa-bbbb-cccccccccccc',
    environment_name: 'מפקדת חטיבה',
    created_at: '2026-02-24T13:00:00Z',
  },
  {
    id: 'notif-08',
    type: 'new_instruction',
    title: 'הנחיה חדשה שובצה אליך',
    body: 'הנחיה "תחזוקה מונעת למחשבי שרת" במערך תקשו"ב',
    read: true,
    instruction_id: 'inst-06-aaaa-bbbb-cccccccccccc',
    environment_id: 'env-02-aaaa-bbbb-cccccccccccc',
    environment_name: 'מערך תקשו"ב',
    created_at: '2026-02-23T15:30:00Z',
  },
];

export let mockNotificationPreferences: NotificationPreferencesDto = {
  new_instruction: true,
  approaching_due: true,
  approaching_due_days: 3,
  overdue: true,
  summary_report: false,
  summary_frequency_days: 7,
  summary_day_of_week: 0,
  channel: 'both',
};
