import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui';
import {
  TrendingUp, CheckCircle, AlertTriangle,
  ClipboardList, Users, Timer,
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import { StatusChip, PriorityChip } from './StatusChip';
import { UserAvatarGroup } from '@/components/common';
import type { InstructionStats, InstructionListItem } from '@/types';

interface DashboardViewProps {
  stats: InstructionStats;
  instructions: InstructionListItem[];
  envId: string;
}

const PIE_COLORS: Record<string, string> = {
  'ממתין לביצוע': '#3b82f6',
  'בביצוע': '#f59e0b',
  'בוצע': '#10b981',
  'בארכיון': '#6b7280',
};

interface AssigneeLoad {
  name: string;
  open: number;
  inProgress: number;
  completed: number;
  total: number;
}

const iconMap: Record<string, React.ReactNode> = {
  'סה״כ הנחיות': <ClipboardList className="w-7 h-7 opacity-70" style={{ color: '#3f51b5' }} />,
  'ממתינות לביצוע': <ClipboardList className="w-7 h-7 opacity-70" style={{ color: '#3b82f6' }} />,
  'בביצוע': <Timer className="w-7 h-7 opacity-70" style={{ color: '#f59e0b' }} />,
  'בוצעו': <CheckCircle className="w-7 h-7 opacity-70" style={{ color: '#10b981' }} />,
  'חריגה מתג״ב': <AlertTriangle className="w-7 h-7 opacity-70" style={{ color: '#ef4444' }} />,
  'צפויות השבוע': <TrendingUp className="w-7 h-7 opacity-70" style={{ color: '#8b5cf6' }} />,
};

export function DashboardView({ stats, instructions, envId }: DashboardViewProps) {
  const navigate = useNavigate();

  const pieData = useMemo(
    () =>
      [
        { name: 'ממתין לביצוע', value: stats.open },
        { name: 'בביצוע', value: stats.inProgress },
        { name: 'בוצע', value: stats.completed },
        { name: 'בארכיון', value: stats.archived },
      ].filter((d) => d.value > 0),
    [stats]
  );

  const urgentInstructions = useMemo(() => {
    const now = new Date();
    return instructions
      .filter((i) => {
        if (i.status === 'completed' || i.status === 'archived') return false;
        const isUrgent = i.priority === 'urgent';
        const isOverdue = i.dueDate && i.dueDate.getTime() < now.getTime();
        return isUrgent || isOverdue;
      })
      .slice(0, 5);
  }, [instructions]);

  const assigneeLoadData = useMemo<AssigneeLoad[]>(() => {
    const map = new Map<string, AssigneeLoad>();
    instructions.forEach((inst) => {
      inst.assignees.forEach((a) => {
        const existing = map.get(a.user.id);
        if (!existing) {
          map.set(a.user.id, { name: a.user.name, open: 0, inProgress: 0, completed: 0, total: 0 });
        }
        const entry = map.get(a.user.id)!;
        entry.total++;
        if (inst.status === 'open') entry.open++;
        else if (inst.status === 'in_progress') entry.inProgress++;
        else if (inst.status === 'completed') entry.completed++;
      });
    });
    return Array.from(map.values()).sort((a, b) => b.total - a.total);
  }, [instructions]);

  const completionRate = useMemo(() => {
    if (stats.total === 0) return 0;
    return Math.round((stats.completed / stats.total) * 100);
  }, [stats]);

  const dueSoonCount = useMemo(() => {
    const now = new Date();
    const weekFromNow = new Date();
    weekFromNow.setDate(weekFromNow.getDate() + 7);
    return instructions.filter((i) => {
      if (!i.dueDate || i.status === 'completed' || i.status === 'archived') return false;
      return i.dueDate >= now && i.dueDate <= weekFromNow;
    }).length;
  }, [instructions]);

  const summaryCards = [
    { label: 'סה״כ הנחיות', value: stats.total, color: '#3f51b5' },
    { label: 'ממתינות לביצוע', value: stats.open, color: '#3b82f6' },
    { label: 'בביצוע', value: stats.inProgress, color: '#f59e0b' },
    { label: 'בוצעו', value: stats.completed, color: '#10b981' },
    { label: 'חריגה מתג״ב', value: stats.overdue, color: '#ef4444' },
    { label: 'צפויות השבוע', value: dueSoonCount, color: '#8b5cf6' },
  ];

  return (
    <div>
      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-4">
        {summaryCards.map((card) => (
          <div
            key={card.label}
            className="bg-paper rounded-lg shadow-card p-4 h-full"
            style={{ borderTop: `3px solid ${card.color}` }}
          >
            <div className="mb-2">{iconMap[card.label]}</div>
            <div className="text-3xl font-bold mb-1" style={{ color: card.color }}>
              {card.value}
            </div>
            <div className="text-xs text-text-secondary font-medium">{card.label}</div>
          </div>
        ))}
      </div>

      {/* Completion Rate Bar */}
      <div className="bg-paper rounded-lg shadow-card p-4 mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-text-primary">אחוז ביצוע</span>
          <span className="text-lg font-bold text-success">{completionRate}%</span>
        </div>
        <Progress value={completionRate} />
        <div className="flex justify-between mt-2">
          <span className="text-xs text-text-secondary">
            {stats.completed} בוצעו מתוך {stats.total}
          </span>
          <span className="text-xs text-text-secondary">
            {stats.open + stats.inProgress} בתהליך
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Pie Chart */}
        <div className="lg:col-span-5 bg-paper rounded-lg shadow-card p-5">
          <h3 className="text-base font-semibold text-text-primary mb-3">התפלגות לפי מצב</h3>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {pieData.map((entry) => (
                    <Cell key={entry.name} fill={PIE_COLORS[entry.name] || '#ccc'} stroke="none" />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => [value, 'הנחיות']} />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  formatter={(value: string) => (
                    <span style={{ fontSize: '0.85rem', color: '#374151' }}>{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[280px] flex items-center justify-center">
              <span className="text-text-secondary">אין נתונים להצגה</span>
            </div>
          )}
        </div>

        {/* Bar Chart - Assignee Load */}
        <div className="lg:col-span-7 bg-paper rounded-lg shadow-card p-5">
          <div className="flex items-center gap-2 mb-3">
            <Users className="w-5 h-5 text-text-secondary" />
            <h3 className="text-base font-semibold text-text-primary">עומס לפי ממונה</h3>
          </div>
          {assigneeLoadData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={assigneeLoadData} layout="vertical" margin={{ top: 5, right: 30, left: 60, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" allowDecimals={false} />
                <YAxis type="category" dataKey="name" width={80} tick={{ fontSize: 13 }} />
                <Tooltip
                  formatter={(value: number, name: string) => {
                    const labels: Record<string, string> = { open: 'ממתינות', inProgress: 'בביצוע', completed: 'בוצעו' };
                    return [value, labels[name] || name];
                  }}
                />
                <Legend
                  formatter={(value: string) => {
                    const labels: Record<string, string> = { open: 'ממתינות', inProgress: 'בביצוע', completed: 'בוצעו' };
                    return labels[value] || value;
                  }}
                />
                <Bar dataKey="open" stackId="a" fill="#3b82f6" radius={[0, 0, 0, 0]} />
                <Bar dataKey="inProgress" stackId="a" fill="#f59e0b" />
                <Bar dataKey="completed" stackId="a" fill="#10b981" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[280px] flex items-center justify-center">
              <span className="text-text-secondary">אין נתונים להצגה</span>
            </div>
          )}
        </div>

        {/* Urgent Tasks Mini-Table */}
        <div className="lg:col-span-7 bg-paper rounded-lg shadow-card p-5">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-5 h-5 text-error" />
            <h3 className="text-base font-semibold text-text-primary">הנחיות דחופות</h3>
            {urgentInstructions.length > 0 && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-error-light text-error">
                {urgentInstructions.length}
              </span>
            )}
          </div>
          {urgentInstructions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-start py-2 px-2 font-semibold text-text-secondary text-xs">דחיפות</th>
                    <th className="text-start py-2 px-2 font-semibold text-text-secondary text-xs">כותרת</th>
                    <th className="text-start py-2 px-2 font-semibold text-text-secondary text-xs">מצב</th>
                    <th className="text-start py-2 px-2 font-semibold text-text-secondary text-xs">ממונים</th>
                    <th className="text-start py-2 px-2 font-semibold text-text-secondary text-xs">תג״ב</th>
                  </tr>
                </thead>
                <tbody>
                  {urgentInstructions.map((inst) => (
                    <tr
                      key={inst.id}
                      onClick={() => navigate(`/env/${envId}/i/${inst.id}`)}
                      className="border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-2 px-2"><PriorityChip priority={inst.priority} /></td>
                      <td className="py-2 px-2">
                        <span className="font-medium truncate max-w-[250px] block">{inst.title}</span>
                      </td>
                      <td className="py-2 px-2"><StatusChip status={inst.status} /></td>
                      <td className="py-2 px-2">
                        <UserAvatarGroup users={inst.assignees.map((a) => a.user)} max={2} size={24} />
                      </td>
                      <td className="py-2 px-2">
                        <span
                          className={cn(
                            'text-sm',
                            inst.dueDate && inst.dueDate < new Date() ? 'text-error font-semibold' : 'text-text-secondary'
                          )}
                        >
                          {inst.dueDate ? inst.dueDate.toLocaleDateString('he-IL') : '—'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-8 text-center">
              <span className="text-text-secondary">אין הנחיות דחופות כרגע</span>
            </div>
          )}
        </div>

        {/* Recent Activity Feed */}
        <div className="lg:col-span-5 bg-paper rounded-lg shadow-card p-5">
          <h3 className="text-base font-semibold text-text-primary mb-3">פעילות אחרונה</h3>
          <ActivityFeed instructions={instructions} />
        </div>
      </div>
    </div>
  );
}

/** Simulated recent activity feed based on instruction data */
function ActivityFeed({ instructions }: { instructions: InstructionListItem[] }) {
  const recentItems = useMemo(() => {
    const items: { id: string; text: string; time: Date; color: string }[] = [];

    instructions.forEach((inst) => {
      if (inst.status === 'completed') {
        items.push({ id: `${inst.id}-completed`, text: `"${inst.title}" — בוצע`, time: inst.createdAt, color: '#10b981' });
      } else if (inst.status === 'in_progress') {
        items.push({ id: `${inst.id}-progress`, text: `"${inst.title}" — בביצוע`, time: inst.createdAt, color: '#f59e0b' });
      }
      if (inst.priority === 'urgent') {
        items.push({ id: `${inst.id}-urgent`, text: `"${inst.title}" — סומן מבצעי`, time: inst.createdAt, color: '#ef4444' });
      }
    });

    return items.sort((a, b) => b.time.getTime() - a.time.getTime()).slice(0, 8);
  }, [instructions]);

  if (recentItems.length === 0) {
    return (
      <div className="py-8 text-center">
        <span className="text-text-secondary">אין פעילות אחרונה</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {recentItems.map((item, idx) => (
        <div
          key={item.id}
          className={cn(
            'flex items-start gap-3 py-3',
            idx < recentItems.length - 1 && 'border-b border-gray-100'
          )}
        >
          <div
            className="w-2 h-2 rounded-full mt-1.5 shrink-0"
            style={{ backgroundColor: item.color }}
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm leading-relaxed line-clamp-2">{item.text}</p>
            <span className="text-xs text-text-disabled">{item.time.toLocaleDateString('he-IL')}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
