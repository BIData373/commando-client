/** Pagination request parameters */
export interface PaginationParams {
  page: number;
  pageSize: number;
}

/** Paginated response wrapper */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/** Sort direction */
export type SortDirection = 'asc' | 'desc';

/** Sort parameters */
export interface SortParams {
  field: string;
  direction: SortDirection;
}

/** Instruction status values */
export type InstructionStatus = 'open' | 'in_progress' | 'completed' | 'archived';

/** Instruction priority values */
export type InstructionPriority = 'low' | 'medium' | 'high' | 'urgent';

/** Due-date type values */
export type DueDateType = 'routine' | 'immediate' | 'date';

/** Hebrew due-date type labels */
export const DUE_DATE_TYPE_LABELS: Record<DueDateType, string> = {
  routine: 'שוטף',
  immediate: 'מיידי',
  date: 'תאריך',
};

/** Environment member role values */
export type MemberRole = 'manager' | 'responsible';

/** Activity action types */
export type ActivityAction =
  | 'created'
  | 'status_changed'
  | 'assigned'
  | 'unassigned'
  | 'commented'
  | 'edited'
  | 'tag_added'
  | 'tag_removed'
  | 'due_date_changed'
  | 'priority_changed'
  | 'attachment_added'
  | 'attachment_removed'
  | 'archived'
  | 'restored';

/** Status display info for UI */
export interface StatusInfo {
  value: InstructionStatus;
  label: string;
  color: string;
}

/** Priority display info for UI */
export interface PriorityInfo {
  value: InstructionPriority;
  label: string;
  color: string;
}

/** Hebrew status labels (military) */
export const STATUS_LABELS: Record<InstructionStatus, string> = {
  open: 'ממתין לביצוע',
  in_progress: 'בביצוע',
  completed: 'בוצע',
  archived: 'בארכיון',
};

/** Hebrew priority labels (military) */
export const PRIORITY_LABELS: Record<InstructionPriority, string> = {
  low: 'נמוכה',
  medium: 'שגרתית',
  high: 'גבוהה',
  urgent: 'מבצעי',
};

/** Status color mapping */
export const STATUS_COLORS: Record<InstructionStatus, string> = {
  open: '#3b82f6',
  in_progress: '#f59e0b',
  completed: '#10b981',
  archived: '#6b7280',
};

/** Priority color mapping */
export const PRIORITY_COLORS: Record<InstructionPriority, string> = {
  low: '#6b7280',
  medium: '#3b82f6',
  high: '#f59e0b',
  urgent: '#ef4444',
};

/** Hebrew role labels */
export const ROLE_LABELS: Record<MemberRole, string> = {
  manager: 'מנהל סביבה',
  responsible: 'אחראי',
};
