import { useState, useMemo } from 'react';
import {
  PlusCircle, ArrowLeftRight, UserPlus, UserMinus,
  MessageCircle, Pencil, Tag, Calendar,
  AlertTriangle, Paperclip, Archive, RotateCcw, ArrowRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Spinner } from '@/components/ui';
import { useActivity } from '@/hooks/useActivity';
import type { ActivityEvent, ActivityAction } from '@/types';

interface ActivityTimelineProps {
  open: boolean;
  onClose: () => void;
  instructionId: string;
}

const ACTION_CONFIG: Record<ActivityAction, { icon: React.ReactNode; label: string; color: string; group: string }> = {
  created: { icon: <PlusCircle className="w-3.5 h-3.5" />, label: 'יצר את ההנחיה', color: '#3f51b5', group: 'כללי' },
  status_changed: { icon: <ArrowLeftRight className="w-3.5 h-3.5" />, label: 'שינה מצב', color: '#f59e0b', group: 'מצב' },
  assigned: { icon: <UserPlus className="w-3.5 h-3.5" />, label: 'שיבץ', color: '#10b981', group: 'שיבוץ' },
  unassigned: { icon: <UserMinus className="w-3.5 h-3.5" />, label: 'הסיר שיבוץ', color: '#ef4444', group: 'שיבוץ' },
  commented: { icon: <MessageCircle className="w-3.5 h-3.5" />, label: 'דיווח', color: '#3b82f6', group: 'דיווחים' },
  edited: { icon: <Pencil className="w-3.5 h-3.5" />, label: 'עדכן', color: '#8b5cf6', group: 'עדכון' },
  tag_added: { icon: <Tag className="w-3.5 h-3.5" />, label: 'הוסיף סימון', color: '#06b6d4', group: 'סימונים' },
  tag_removed: { icon: <Tag className="w-3.5 h-3.5" />, label: 'הסיר סימון', color: '#6b7280', group: 'סימונים' },
  due_date_changed: { icon: <Calendar className="w-3.5 h-3.5" />, label: 'שינה תג״ב', color: '#f59e0b', group: 'עדכון' },
  priority_changed: { icon: <AlertTriangle className="w-3.5 h-3.5" />, label: 'שינה דחיפות', color: '#ef4444', group: 'עדכון' },
  attachment_added: { icon: <Paperclip className="w-3.5 h-3.5" />, label: 'הוסיף קובץ', color: '#10b981', group: 'קבצים' },
  attachment_removed: { icon: <Paperclip className="w-3.5 h-3.5" />, label: 'הסיר קובץ', color: '#6b7280', group: 'קבצים' },
  archived: { icon: <Archive className="w-3.5 h-3.5" />, label: 'העביר לארכיון', color: '#6b7280', group: 'כללי' },
  restored: { icon: <RotateCcw className="w-3.5 h-3.5" />, label: 'שחזר מארכיון', color: '#3b82f6', group: 'כללי' },
};

const FILTER_GROUPS = [...new Set(Object.values(ACTION_CONFIG).map((c) => c.group))];

function getActivityDescription(event: ActivityEvent): string {
  const config = ACTION_CONFIG[event.action];
  let desc = config.label;

  if (event.action === 'status_changed' && event.metadata.oldValue && event.metadata.newValue) {
    desc += ` מ-"${event.metadata.oldValue}" ל-"${event.metadata.newValue}"`;
  }
  if (event.action === 'assigned' && event.metadata.targetUser) {
    desc += ` את ${event.metadata.targetUser.name}`;
  }
  if (event.action === 'unassigned' && event.metadata.targetUser) {
    desc += ` את ${event.metadata.targetUser.name}`;
  }
  if ((event.action === 'tag_added' || event.action === 'tag_removed') && event.metadata.tagName) {
    desc += `: ${event.metadata.tagName}`;
  }
  if (event.action === 'priority_changed' && event.metadata.oldValue && event.metadata.newValue) {
    desc += ` מ-"${event.metadata.oldValue}" ל-"${event.metadata.newValue}"`;
  }
  if (event.action === 'due_date_changed' && event.metadata.oldValue && event.metadata.newValue) {
    desc += ` מ-${event.metadata.oldValue} ל-${event.metadata.newValue}`;
  }
  if (event.action === 'commented' && event.metadata.commentPreview) {
    desc += ` — "${event.metadata.commentPreview}"`;
  }

  return desc;
}

function formatDateTime(date: Date): string {
  return date.toLocaleDateString('he-IL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function ActivityTimeline({ open, onClose, instructionId }: ActivityTimelineProps) {
  const { data: events, isLoading } = useActivity(instructionId);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const filteredEvents = useMemo(() => {
    if (!events) return [];
    if (!activeFilter) return events;
    return events.filter((e) => ACTION_CONFIG[e.action].group === activeFilter);
  }, [events, activeFilter]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-stretch justify-end bg-slate-900/10 backdrop-blur-[2px]"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-sm h-full shadow-xl animate-slide-in-right p-8 overflow-y-auto border-s border-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-lg font-bold text-slate-900">יומן פעילות</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-900 transition-colors cursor-pointer"
            aria-label="סגור"
          >
            <ArrowRight size={24} className="rotate-180" />
          </button>
        </div>

        {/* Filter chips */}
        <div className="flex flex-wrap gap-1.5 mb-6">
          <button
            onClick={() => setActiveFilter(null)}
            className={cn(
              'px-2.5 py-1 rounded-md text-[10px] font-bold border transition-colors cursor-pointer',
              !activeFilter
                ? 'bg-indigo-50 text-indigo-600 border-indigo-100'
                : 'bg-slate-50 text-slate-400 border-slate-100 hover:bg-slate-100'
            )}
          >
            הכל
          </button>
          {FILTER_GROUPS.map((group) => (
            <button
              key={group}
              onClick={() => setActiveFilter(group)}
              className={cn(
                'px-2.5 py-1 rounded-md text-[10px] font-bold border transition-colors cursor-pointer',
                activeFilter === group
                  ? 'bg-indigo-50 text-indigo-600 border-indigo-100'
                  : 'bg-slate-50 text-slate-400 border-slate-100 hover:bg-slate-100'
              )}
            >
              {group}
            </button>
          ))}
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="py-8 text-center">
            <Spinner size={24} />
          </div>
        )}

        {/* Empty */}
        {filteredEvents.length === 0 && !isLoading && (
          <div className="py-8 text-center">
            <span className="text-sm text-slate-400">
              {activeFilter ? 'אין אירועים מסוג זה' : 'אין רשומות ביומן'}
            </span>
          </div>
        )}

        {/* Timeline */}
        {filteredEvents.length > 0 && (
          <div className="space-y-8 relative before:absolute before:end-2 before:top-2 before:bottom-2 before:w-px before:bg-slate-100">
            {filteredEvents.map((event) => (
              <div key={event.id} className="relative pe-8">
                <div className="absolute end-0.5 top-1.5 w-3 h-3 rounded-full bg-white border-2 border-slate-200 z-10" />
                <div className="text-[10px] font-bold text-slate-400 mb-1">
                  {formatDateTime(event.createdAt)}
                </div>
                <div className="text-xs text-slate-700">
                  <span className="font-bold text-slate-900">{event.user.name}</span>{' '}
                  {getActivityDescription(event)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @keyframes slide-in-right {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.4s cubic-bezier(0.05, 0.7, 0.1, 1);
        }
      `}</style>
    </div>
  );
}
