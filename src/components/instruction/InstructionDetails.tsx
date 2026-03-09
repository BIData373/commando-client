import { useState, useRef, useEffect } from 'react';
import { Calendar, Link as LinkIcon, ExternalLink, User as UserIcon, Plus, ChevronDown, MoreHorizontal, Pencil, Archive, Trash2, ArrowLeftRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { STATUS_LABELS } from '@/types';
import { computeAggregatedStatus } from '@/lib/assigneeStatus';
import { StatusChip } from '@/components/environment/StatusChip';
import type { Instruction, InstructionStatus } from '@/types';

interface InstructionDetailsProps {
  instruction: Instruction;
  onStatusChange: (status: InstructionStatus) => void;
  onAssigneeStatusChange?: (assigneeId: string, status: InstructionStatus) => void;
  isAdmin?: boolean;
}

function formatDateHebrew(date: Date | null): string {
  if (!date) return '—';
  return date.toLocaleDateString('he-IL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function getDueDateInfo(dueDate: Date | null, status: InstructionStatus) {
  if (!dueDate || status === 'completed' || status === 'archived') {
    return { label: null, color: '' };
  }
  const now = new Date();
  const diffMs = dueDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return { label: `חרג לפני ${Math.abs(diffDays)} ימים`, color: 'text-rose-600' };
  if (diffDays === 0) return { label: 'היום!', color: 'text-amber-600' };
  if (diffDays === 1) return { label: 'מחר', color: 'text-amber-600' };
  return { label: `בעוד ${diffDays} ימים`, color: 'text-amber-600' };
}

export function InstructionDetails({ instruction, onStatusChange, onAssigneeStatusChange, isAdmin = true }: InstructionDetailsProps) {
  const dueDateInfo = getDueDateInfo(instruction.dueDate, instruction.status);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on outside click
  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [menuOpen]);

  return (
    <section className="space-y-10">
      {/* Section header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <h2 className="text-lg font-bold text-slate-900">פרטי ההנחיה</h2>
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            aria-label="תפריט פעולות"
          >
            <MoreHorizontal size={20} />
          </button>

          {menuOpen && (
            <div className="absolute start-0 top-full mt-1 w-48 bg-white rounded-lg border border-slate-200 shadow-lg z-20 py-1">
              {isAdmin && (
                <MenuButton icon={<Pencil size={15} />} onClick={() => setMenuOpen(false)}>
                  עדכון הנחיה
                </MenuButton>
              )}
              <MenuButton icon={<ArrowLeftRight size={15} />} onClick={() => setMenuOpen(false)}>
                העברה למערך
              </MenuButton>
              <MenuButton icon={<Archive size={15} />} onClick={() => setMenuOpen(false)}>
                העבר לארכיון
              </MenuButton>
              <div className="border-t border-slate-100 my-1" />
              <MenuButton icon={<Trash2 size={15} />} onClick={() => setMenuOpen(false)} variant="danger">
                ביטול הנחיה
              </MenuButton>
            </div>
          )}
        </div>
      </div>

      {/* Grid fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10">
        {/* Status */}
        <div>
          <FieldLabel>מצב זרימה</FieldLabel>
          <div className="flex items-center gap-2">
            {isAdmin ? (
              <div className="relative inline-block w-full max-w-[160px]">
                <select
                  value={instruction.status}
                  onChange={(e) => onStatusChange(e.target.value as InstructionStatus)}
                  className="appearance-none w-full bg-white border border-slate-200 px-3 py-2 rounded-lg text-sm font-medium text-slate-700 outline-none focus:border-indigo-500 transition-all cursor-pointer"
                  aria-label="שנה מצב לכולם"
                >
                  {(Object.entries(STATUS_LABELS) as [InstructionStatus, string][]).map(
                    ([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    )
                  )}
                </select>
                <ChevronDown size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            ) : (
              <span className="text-sm font-medium text-slate-700">
                {STATUS_LABELS[instruction.status]}
              </span>
            )}
            {instruction.assignees.length > 1 && (
              <span className="text-xs text-slate-500">
                ({computeAggregatedStatus(instruction.assignees).progressLabel} השלימו)
              </span>
            )}
          </div>
        </div>

        {/* Assignees */}
        <div>
          <FieldLabel>סגל ממונים</FieldLabel>
          {instruction.assignees.length > 0 ? (
            <div className="flex flex-wrap gap-4">
              {instruction.assignees.map((assignee) => (
                <div key={assignee.id} className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 border border-slate-200">
                    <UserIcon size={14} />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-bold text-slate-800 leading-tight">
                      {assignee.user.name}
                    </span>
                    <StatusChip status={assignee.status} size="small" />
                  </div>
                  {isAdmin && onAssigneeStatusChange && instruction.assignees.length > 1 && (
                    <select
                      value={assignee.status}
                      onChange={(e) => onAssigneeStatusChange(assignee.id, e.target.value as InstructionStatus)}
                      onClick={(e) => e.stopPropagation()}
                      className="text-[10px] border border-slate-200 rounded px-1 py-0.5 text-slate-600 cursor-pointer"
                      aria-label={`שנה מצב עבור ${assignee.user.name}`}
                    >
                      {(Object.entries(STATUS_LABELS) as [InstructionStatus, string][]).map(
                        ([value, label]) => (
                          <option key={value} value={value}>{label}</option>
                        )
                      )}
                    </select>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <span className="text-sm text-slate-400">לא שובצו ממונים</span>
          )}
        </div>

        {/* Due date */}
        <div>
          <FieldLabel>תג״ב</FieldLabel>
          <div className="flex items-center gap-2 text-sm text-slate-700 font-medium">
            <Calendar size={16} className="text-slate-400" />
            <span>{formatDateHebrew(instruction.dueDate)}</span>
            {dueDateInfo.label && (
              <span className={cn('text-[10px] font-bold me-2', dueDateInfo.color)}>
                ({dueDateInfo.label})
              </span>
            )}
          </div>
        </div>

        {/* Source */}
        <div>
          <FieldLabel>גורם מפקד</FieldLabel>
          {instruction.source ? (
            <span className="flex items-center gap-2 text-sm text-indigo-600 font-medium">
              <LinkIcon size={14} />
              <span>{instruction.source}</span>
              <ExternalLink size={12} className="opacity-50" />
            </span>
          ) : (
            <span className="text-sm text-slate-400">—</span>
          )}
        </div>
      </div>

      {/* Tags */}
      <div>
        <FieldLabel>סימוני זיהוי</FieldLabel>
        <div className="flex flex-wrap gap-2">
          {instruction.tags.length > 0 ? (
            instruction.tags.map((tag) => (
              <span
                key={tag.id}
                className="bg-slate-50 text-slate-600 px-3 py-1 rounded-md text-[11px] font-bold border border-slate-100"
              >
                {tag.name}
              </span>
            ))
          ) : (
            <span className="text-sm text-slate-400">אין סימונים</span>
          )}
          {isAdmin && (
            <button className="flex items-center gap-1 text-[11px] font-bold text-indigo-600 px-2 py-1 rounded-md hover:bg-indigo-50 transition-colors cursor-pointer">
              <Plus size={14} />
              שבץ
            </button>
          )}
        </div>
      </div>

      {/* Description */}
      <div>
        <FieldLabel>פירוט</FieldLabel>
        <p className="text-slate-600 leading-relaxed text-sm max-w-3xl">
          {instruction.description || 'אין פירוט'}
        </p>
      </div>

    </section>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="text-[11px] font-bold text-slate-400 block mb-3 uppercase tracking-wider">
      {children}
    </label>
  );
}

function MenuButton({
  icon,
  children,
  onClick,
  variant = 'default',
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
  onClick: () => void;
  variant?: 'default' | 'danger';
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full flex items-center gap-2.5 px-3 py-2 text-sm transition-colors cursor-pointer',
        variant === 'danger'
          ? 'text-rose-600 hover:bg-rose-50'
          : 'text-slate-700 hover:bg-slate-50'
      )}
    >
      {icon}
      {children}
    </button>
  );
}
