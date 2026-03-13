import type { ActivityAction, IActivityEvent } from '../types';

/* ─── Activity descriptions ─── */
export function getActivityDesc(event: IActivityEvent): string {
  const actionMap: Record<ActivityAction, string> = {
    created: 'יצר את ההנחיה',
    statusChanged: 'עודכן סטטוס',
    assigned: 'שובץ',
    unassigned: 'הוסר שיבוץ',
    commented: 'הוסיף הערה',
    edited: 'עודכן',
    tagAdded: 'הוסיף תגית',
    tagRemoved: 'הסיר תגית',
    dueDateChanged: 'עודכן זמנים',
    priorityChanged: 'עודכנה עדיפות',
    attachmentAdded: 'הוסיף קובץ',
    attachmentRemoved: 'הסיר קובץ',
    archived: 'הועבר לארכיון',
    restored: 'שוחזר מארכיון',
  };

  let desc = actionMap[event.action] || event.action;
  if (event.action === 'statusChanged' && event.metadata.oldValue && event.metadata.newValue) {
    desc += `: מ-"${event.metadata.oldValue}" ל-"${event.metadata.newValue}"`;
  }
  if (event.action === 'dueDateChanged' && event.metadata.oldValue && event.metadata.newValue) {
    desc += `: מ-${event.metadata.oldValue} ל-${event.metadata.newValue}`;
  }
  if (event.action === 'edited' && event.metadata.oldValue) {
    desc += `: ${event.metadata.oldValue}`;
  }
  if ((event.action === 'tagAdded' || event.action === 'tagRemoved') && event.metadata.tagName) {
    desc += `: ${event.metadata.tagName}`;
  }
  if (event.action === 'assigned' && event.metadata.targetUser) {
    desc += ` את ${event.metadata.targetUser.name}`;
  }
  return desc;
}

export function formatActivityDate(date: Date): string {
  return date.toLocaleDateString('he-IL', { day: '2-digit', month: '2-digit', year: 'numeric' });
}
