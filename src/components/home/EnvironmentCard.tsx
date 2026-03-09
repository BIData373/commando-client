import { useNavigate } from 'react-router-dom';
import { MoreVertical, ChevronLeft, Clock, ShieldCheck, Pencil, Trash2, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Card,
  Badge,
  Separator,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui';
import type { EnvironmentWithRole } from '@/types';
import { ROLE_LABELS } from '@/types';

/* ─── Helpers ─── */

function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60_000);
  const diffHrs = Math.floor(diffMs / 3_600_000);
  const diffDays = Math.floor(diffMs / 86_400_000);

  if (diffMin < 1) return 'עכשיו';
  if (diffMin < 60) return `לפני ${diffMin} דק'`;
  if (diffHrs < 24) return `לפני ${diffHrs} שע'`;
  if (diffDays < 7) return `לפני ${diffDays} ימים`;
  return date.toLocaleDateString('he-IL', { day: '2-digit', month: '2-digit' });
}

function getInitials(name: string): string {
  return name.substring(0, 2);
}

/* ─── Role styling ─── */

const ROLE_STYLE: Record<string, string> = {
  manager: 'bg-amber-50 text-amber-700',
  responsible: 'bg-blue-50 text-blue-600',
};

const ROLE_DOT: Record<string, string> = {
  manager: 'bg-amber-500',
  responsible: 'bg-blue-500',
};

/* ─── Reusable sub-components ─── */

function StatBlock({ value, label }: { value: number; label: string }) {
  return (
    <div className="text-center min-w-[48px]">
      <span className="block text-xs text-text-secondary">{label}</span>
      <span className="block text-base font-bold text-text-primary leading-tight">{value}</span>
    </div>
  );
}

function ArrowButton({ onClick, label }: { onClick: (e: React.MouseEvent) => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-text-disabled hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-colors cursor-pointer"
      aria-label={label}
    >
      <ChevronLeft className="w-4 h-4" />
    </button>
  );
}

function CardMenu({ onEdit, onSettings, onDelete }: {
  onEdit?: () => void;
  onSettings?: () => void;
  onDelete?: () => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="p-1 rounded-md text-text-disabled hover:text-text-secondary hover:bg-gray-100 transition-colors cursor-pointer opacity-0 group-hover:opacity-100"
        aria-label="אפשרויות"
      >
        <MoreVertical className="w-4 h-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {onEdit && (
          <DropdownMenuItem onClick={onEdit}>
            <Pencil className="w-3.5 h-3.5" />
            עריכה
          </DropdownMenuItem>
        )}
        {onSettings && (
          <DropdownMenuItem onClick={onSettings}>
            <Settings className="w-3.5 h-3.5" />
            הגדרות
          </DropdownMenuItem>
        )}
        {(onEdit || onSettings) && onDelete && <DropdownMenuSeparator />}
        {onDelete && (
          <DropdownMenuItem destructive onClick={onDelete}>
            <Trash2 className="w-3.5 h-3.5" />
            מחיקה
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   PersonalEnvironmentCard  (Right column – tall)
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

interface PersonalEnvironmentCardProps {
  instructionCount?: number;
}

export function PersonalEnvironmentCard({ instructionCount = 12 }: PersonalEnvironmentCardProps) {
  const navigate = useNavigate();

  return (
    <Card className="flex flex-col h-full group hover:shadow-md transition-shadow">
      {/* Top: badge + menu */}
      <div className="flex items-center justify-between px-5 pt-5">
        <CardMenu />
        <Badge className="gap-1.5 bg-purple-50 text-purple-600">
          <ShieldCheck className="w-3 h-3" />
          פרטי
        </Badge>
      </div>

      {/* Content */}
      <button
        onClick={() => navigate('/personal')}
        className="w-full text-start cursor-pointer px-5 pt-5"
        aria-label="כניסה לסביבה האישית"
      >
        {/* Avatar + title */}
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-full bg-pink-500 flex items-center justify-center shrink-0">
            <span className="text-white font-bold text-sm">מט</span>
          </div>
          <h3 className="font-semibold text-text-primary text-[15px] leading-snug">
            הסביבה האישית שלי
          </h3>
        </div>

        {/* Timestamp */}
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-text-disabled" />
          <span className="text-xs text-text-disabled">עודכן לפני 10 דק'</span>
        </div>
      </button>

      {/* Spacer – pushes footer to bottom */}
      <div className="flex-1 min-h-[200px]" />

      {/* Footer pinned to bottom */}
      <div className="px-5 pb-5">
        <Separator className="mb-4" />
        <div className="flex items-center justify-between">
          <ArrowButton
            onClick={(e) => { e.stopPropagation(); navigate('/personal'); }}
            label="כניסה לסביבה האישית"
          />
          <StatBlock value={instructionCount} label="הנחיות" />
        </div>
      </div>
    </Card>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   EnvironmentCard  (Grid item)
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

interface EnvironmentCardProps {
  environment: EnvironmentWithRole;
}

export function EnvironmentCard({ environment }: EnvironmentCardProps) {
  const navigate = useNavigate();
  const roleClass = ROLE_STYLE[environment.currentUserRole] ?? ROLE_STYLE.member;
  const dotClass = ROLE_DOT[environment.currentUserRole] ?? ROLE_DOT.member;

  return (
    <Card className="flex flex-col group hover:shadow-md transition-shadow">
      {/* Top: badge + menu */}
      <div className="flex items-center justify-between px-5 pt-4">
        <CardMenu
          onSettings={() => navigate(`/env/${environment.id}/settings`)}
        />
        <Badge className={cn('gap-1.5', roleClass)}>
          <span className={cn('w-1.5 h-1.5 rounded-full', dotClass)} />
          {ROLE_LABELS[environment.currentUserRole]}
        </Badge>
      </div>

      {/* Content */}
      <button
        onClick={() => navigate(`/env/${environment.id}`)}
        className="flex-1 w-full text-start cursor-pointer px-5 pt-4 pb-4"
        aria-label={`כניסה לסביבה ${environment.name}`}
      >
        {/* Avatar + name */}
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-dark to-secondary flex items-center justify-center shrink-0">
            <span className="text-white font-bold text-sm">{getInitials(environment.name)}</span>
          </div>
          <h3 className="font-semibold text-text-primary text-[15px] leading-snug truncate">
            {environment.name}
          </h3>
        </div>

        {/* Timestamp */}
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-text-disabled" />
          <span className="text-xs text-text-disabled">
            עודכן {getTimeAgo(environment.updatedAt)}
          </span>
        </div>
      </button>

      {/* Footer */}
      <div className="px-5 pb-4">
        <Separator className="mb-3" />
        <div className="flex items-center justify-between">
          <ArrowButton
            onClick={(e) => { e.stopPropagation(); navigate(`/env/${environment.id}`); }}
            label="כניסה לסביבה"
          />
          <div className="flex items-center gap-5">
            <StatBlock value={environment.memberCount} label="צוות" />
            <StatBlock value={environment.instructionCount} label="הנחיות" />
          </div>
        </div>
      </div>
    </Card>
  );
}
