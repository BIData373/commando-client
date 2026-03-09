/** Notification type categories */
export type NotificationType =
  | 'new_instruction'
  | 'approaching_due'
  | 'overdue'
  | 'summary';

/** A single notification item */
export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  read: boolean;
  instructionId: string | null;
  environmentId: string | null;
  environmentName: string | null;
  createdAt: Date;
}

/** User notification preferences */
export interface NotificationPreferences {
  newInstruction: boolean;
  approachingDue: boolean;
  approachingDueDays: number;
  overdue: boolean;
  summaryReport: boolean;
  summaryFrequencyDays: number;
  summaryDayOfWeek: number;
  channel: 'chat' | 'email' | 'both';
}
