import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  Bell, Clock, AlertTriangle, ClipboardList, CheckCheck,
} from 'lucide-react';
import { useNotifications, useMarkAsRead, useMarkAllAsRead } from '@/hooks/useNotifications';
import type { Notification, NotificationType } from '@/types';

interface NotificationPanelProps {
  onClose: () => void;
}

const TYPE_CONFIG: Record<NotificationType, { icon: React.ReactNode; color: string }> = {
  new_instruction: {
    icon: <Bell className="w-4 h-4" />,
    color: '#6366f1',
  },
  approaching_due: {
    icon: <Clock className="w-4 h-4" />,
    color: '#f59e0b',
  },
  overdue: {
    icon: <AlertTriangle className="w-4 h-4" />,
    color: '#ef4444',
  },
  summary: {
    icon: <ClipboardList className="w-4 h-4" />,
    color: '#10b981',
  },
};

function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return 'עכשיו';
  if (diffMins < 60) return `לפני ${diffMins} דק׳`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `לפני ${diffHours} שע׳`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `לפני ${diffDays} ימים`;
  return date.toLocaleDateString('he-IL');
}

export function NotificationPanel({ onClose }: NotificationPanelProps) {
  const navigate = useNavigate();
  const { data: notifications, isLoading } = useNotifications();
  const markAsRead = useMarkAsRead();
  const markAllAsRead = useMarkAllAsRead();

  const unreadCount = notifications?.filter((n) => !n.read).length ?? 0;

  const handleClick = (notif: Notification) => {
    if (!notif.read) {
      markAsRead.mutate(notif.id);
    }
    if (notif.instructionId && notif.environmentId) {
      navigate(`/env/${notif.environmentId}/i/${notif.instructionId}`);
      onClose();
    }
  };

  const handleMarkAll = () => {
    markAllAsRead.mutate();
  };

  return (
    <div
      className="absolute top-full mt-2 start-0 z-50 w-[380px] rounded-xl overflow-hidden"
      style={{
        background: '#fff',
        border: '1px solid #e5e7eb',
        boxShadow: '0 10px 40px -10px rgba(0,0,0,0.2)',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <h3 className="text-sm font-bold text-slate-900">התראות</h3>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAll}
            className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-700 font-medium cursor-pointer transition-colors"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            סמן הכל כנקרא
          </button>
        )}
      </div>

      {/* Notification list */}
      <div className="max-h-[400px] overflow-y-auto">
        {isLoading && (
          <div className="py-10 text-center text-sm text-slate-400">טוען...</div>
        )}

        {!isLoading && (!notifications || notifications.length === 0) && (
          <div className="py-10 text-center">
            <Bell className="w-8 h-8 text-slate-200 mx-auto mb-2" />
            <p className="text-sm text-slate-400">אין התראות חדשות</p>
          </div>
        )}

        {notifications?.map((notif) => {
          const config = TYPE_CONFIG[notif.type];
          return (
            <button
              key={notif.id}
              onClick={() => handleClick(notif)}
              className={cn(
                'flex items-start gap-3 w-full px-4 py-3 text-start transition-colors cursor-pointer border-b border-gray-50 last:border-b-0',
                notif.read
                  ? 'bg-white hover:bg-slate-50'
                  : 'bg-indigo-50/40 hover:bg-indigo-50/70'
              )}
            >
              {/* Icon */}
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                style={{ backgroundColor: `${config.color}14`, color: config.color }}
              >
                {config.icon}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-slate-800 truncate">
                    {notif.title}
                  </p>
                  {!notif.read && (
                    <span className="w-2 h-2 rounded-full bg-indigo-600 shrink-0" />
                  )}
                </div>
                <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">
                  {notif.body}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[0.65rem] text-slate-300">
                    {getTimeAgo(notif.createdAt)}
                  </span>
                  {notif.environmentName && (
                    <>
                      <span className="text-slate-200">·</span>
                      <span className="text-[0.65rem] text-slate-400">
                        {notif.environmentName}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
