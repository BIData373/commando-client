import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ClipboardList, AlertTriangle, Clock, CheckCircle2,
  Plus, Users, Settings, ChevronLeft, Flag,
} from 'lucide-react';
import { StatusChip } from './StatusChip';
import { PriorityChip } from './StatusChip';
import { UserAvatarGroup } from '@/components/common/UserAvatarGroup';
import type { InstructionListItem, InstructionStats } from '@/types';

interface EnvironmentHomeDashboardProps {
  envId: string;
  stats: InstructionStats;
  instructions: InstructionListItem[];
  onViewInstruction: (id: string) => void;
  onNavigateToInstructions: () => void;
  onCreateInstruction: () => void;
}

export function EnvironmentHomeDashboard({
  envId,
  stats,
  instructions,
  onViewInstruction,
  onNavigateToInstructions,
  onCreateInstruction,
}: EnvironmentHomeDashboardProps) {
  const navigate = useNavigate();

  // KPI data
  const activeCount = stats.total - stats.archived;
  const urgentCount = stats.urgent;
  const waitingCount = stats.open;
  const completedThisWeek = useMemo(
    () => instructions.filter((i) => i.status === 'completed').length,
    [instructions]
  );

  // Important instructions (marked with checkbox)
  const allImportant = useMemo(() => {
    return instructions.filter((i) => i.isImportant && i.status !== 'archived');
  }, [instructions]);

  const importantCompleted = useMemo(
    () => allImportant.filter((i) => i.status === 'completed').length,
    [allImportant]
  );

  const importantInstructions = useMemo(() => {
    return [...allImportant]
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
      .slice(0, 5);
  }, [allImportant]);

  // 5 most recently created
  const recentInstructions = useMemo(() => {
    return [...instructions]
      .filter((i) => i.status !== 'archived')
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 5);
  }, [instructions]);

  const formatDate = (date: Date | null) => {
    if (!date) return '—';
    return date.toLocaleDateString('he-IL', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
    });
  };


  const kpiCards = [
    {
      label: 'סה״כ הנחיות פעילות',
      value: activeCount,
      icon: <ClipboardList className="w-6 h-6" />,
      color: '#3b82f6',
    },
    {
      label: 'הנחיות דחופות',
      value: urgentCount,
      icon: <AlertTriangle className="w-6 h-6" />,
      color: '#ef4444',
    },
    {
      label: 'ממתינות לביצוע',
      value: waitingCount,
      icon: <Clock className="w-6 h-6" />,
      color: '#f59e0b',
    },
    {
      label: 'בוצעו השבוע',
      value: completedThisWeek,
      icon: <CheckCircle2 className="w-6 h-6" />,
      color: '#10b981',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-text-primary">מבט מהיר</h2>
        <p className="text-sm text-text-secondary mt-1">
          סיכום מצב ההנחיות בסביבה
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4">
        {kpiCards.map((card) => (
          <div
            key={card.label}
            className="bg-white rounded-xl shadow-card border border-slate-100 p-5 flex items-start gap-4"
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: `${card.color}12`, color: card.color }}
            >
              {card.icon}
            </div>
            <div>
              <p className="text-sm text-text-secondary font-medium">
                {card.label}
              </p>
              <p className="text-3xl font-bold text-text-primary mt-1">
                {card.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Main content: 2 columns */}
      <div className="grid grid-cols-3 gap-6">
        {/* Left 2 cols: tables */}
        <div className="col-span-2 space-y-6">
          {/* Important Instructions (marked with checkbox) */}
          <div className="bg-white rounded-xl shadow-card border border-slate-100">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Flag className="w-5 h-5 text-amber-500 fill-amber-500" />
                <h3 className="text-base font-bold text-text-primary">
                  הנחיות חשובות
                </h3>
              </div>
              <button
                onClick={onNavigateToInstructions}
                className="text-sm text-primary hover:text-primary-dark font-medium cursor-pointer flex items-center gap-1"
              >
                צפה בהכל
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>

            {importantInstructions.length === 0 ? (
              <div className="px-6 py-8 text-center text-text-secondary text-sm">
                אין הנחיות חשובות כרגע
              </div>
            ) : (
              <div className="divide-y divide-slate-50">
                {importantInstructions.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => onViewInstruction(item.id)}
                    className="flex items-center gap-4 w-full px-6 py-3.5 text-start hover:bg-slate-50/70 transition-colors cursor-pointer"
                  >
                    <Flag className="w-4 h-4 text-amber-500 fill-amber-500 shrink-0" />
                    <span className="flex-1 text-sm font-medium text-text-primary truncate">
                      {item.title}
                    </span>
                    <div className="shrink-0">
                      <UserAvatarGroup
                        users={item.assignees.map((a) => a.user)}
                        max={3}
                        size={28}
                      />
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <StatusChip status={item.status} />
                    </div>
                    <span className="text-xs text-text-secondary shrink-0 w-[70px] text-center">
                      {formatDate(item.dueDate)}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Recently Created */}
          <div className="bg-white rounded-xl shadow-card border border-slate-100">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h3 className="text-base font-bold text-text-primary">
                הנחיות אחרונות שנוצרו
              </h3>
              <button
                onClick={onNavigateToInstructions}
                className="text-sm text-primary hover:text-primary-dark font-medium cursor-pointer flex items-center gap-1"
              >
                צפה בהכל
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>

            {recentInstructions.length === 0 ? (
              <div className="px-6 py-8 text-center text-text-secondary text-sm">
                אין הנחיות להצגה
              </div>
            ) : (
              <div className="divide-y divide-slate-50">
                {recentInstructions.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => onViewInstruction(item.id)}
                    className="flex items-center gap-4 w-full px-6 py-3.5 text-start hover:bg-slate-50/70 transition-colors cursor-pointer"
                  >
                    {/* Title */}
                    <span className="flex-1 text-sm font-medium text-text-primary truncate">
                      {item.title}
                    </span>

                    {/* Priority + Status */}
                    <div className="flex items-center gap-2 shrink-0">
                      <PriorityChip priority={item.priority} />
                      <StatusChip status={item.status} />
                    </div>

                    {/* Created date */}
                    <span className="text-xs text-text-secondary shrink-0 w-[70px] text-center">
                      {formatDate(item.createdAt)}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right col: Pie Chart + Quick Actions */}
        <div className="col-span-1 space-y-6">
          {/* Important Instructions Pie Chart */}
          <div className="bg-white rounded-xl shadow-card border border-slate-100 p-6">
            <div className="flex items-center gap-2 mb-5">
              <Flag className="w-5 h-5 text-amber-500 fill-amber-500" />
              <h3 className="text-base font-bold text-text-primary">
                התקדמות הנחיות חשובות
              </h3>
            </div>
            <ImportantPieChart
              completed={importantCompleted}
              total={allImportant.length}
            />
          </div>

          <div className="bg-white rounded-xl shadow-card border border-slate-100 p-6">
            <h3 className="text-base font-bold text-text-primary mb-4">
              פעולות מהירות
            </h3>
            <div className="space-y-3">
              <QuickActionButton
                icon={<Plus className="w-5 h-5" />}
                label="יצירת הנחיה חדשה"
                description="הוסף הנחיה חדשה למערך"
                onClick={onCreateInstruction}
              />
              <QuickActionButton
                icon={<Users className="w-5 h-5" />}
                label="ניהול אחראים"
                description="הגדרת קבוצות אחראים"
                onClick={() => navigate(`/env/${envId}/settings`)}
              />
              <QuickActionButton
                icon={<Settings className="w-5 h-5" />}
                label="פרמטרי מערך"
                description="הגדרות כלליות, תגיות והרשאות"
                onClick={() => navigate(`/env/${envId}/settings`)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ImportantPieChart({
  completed,
  total,
}: {
  completed: number;
  total: number;
}) {
  const size = 140;
  const strokeWidth = 16;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const ratio = total > 0 ? completed / total : 0;
  const percent = Math.round(ratio * 100);
  const offset = circumference * (1 - ratio);
  const isComplete = completed === total && total > 0;
  const remaining = total - completed;

  if (total === 0) {
    return (
      <div className="flex flex-col items-center py-4">
        <div className="relative" style={{ width: size, height: size }}>
          <svg width={size} height={size}>
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="#f1f5f9"
              strokeWidth={strokeWidth}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-slate-300">—</span>
            <span className="text-xs text-text-secondary mt-0.5">אין נתונים</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      {/* Pie chart */}
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          {/* Background ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#fef3c7"
            strokeWidth={strokeWidth}
          />
          {/* Completed arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={isComplete ? '#10b981' : '#f59e0b'}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
          />
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="text-3xl font-extrabold"
            style={{ color: isComplete ? '#10b981' : '#f59e0b' }}
          >
            {percent}%
          </span>
          <span className="text-[11px] text-text-secondary font-medium">
            {completed} מתוך {total}
          </span>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-5 mt-4">
        <div className="flex items-center gap-1.5">
          <span
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: isComplete ? '#10b981' : '#f59e0b' }}
          />
          <span className="text-xs text-text-secondary">בוצעו ({completed})</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-100" />
          <span className="text-xs text-text-secondary">נותרו ({remaining})</span>
        </div>
      </div>
    </div>
  );
}

function QuickActionButton({
  icon,
  label,
  description,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 w-full p-3.5 rounded-xl border border-slate-100 hover:bg-slate-50 hover:border-slate-200 transition-colors cursor-pointer text-start"
    >
      <div className="w-10 h-10 rounded-lg bg-primary/8 text-primary flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-text-primary">{label}</p>
        <p className="text-xs text-text-secondary mt-0.5">{description}</p>
      </div>
    </button>
  );
}
