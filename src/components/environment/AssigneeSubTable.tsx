import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { StatusChip } from './StatusChip';
import { UserAvatar } from '@/components/common/UserAvatar';
import { STATUS_LABELS } from '@/types';
import type { InstructionAssignee, InstructionStatus } from '@/types';

interface AssigneeSubTableProps {
  assignees: InstructionAssignee[];
  onAssigneeStatusChange?: (assigneeId: string, status: InstructionStatus) => void;
  onBatchStatusChange?: (status: InstructionStatus) => void;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('he-IL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

function useDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  return { open, setOpen, ref };
}

const statusOptions: InstructionStatus[] = ['open', 'in_progress', 'completed', 'archived'];

export function AssigneeSubTable({
  assignees,
  onAssigneeStatusChange,
  onBatchStatusChange,
}: AssigneeSubTableProps) {
  const batchDropdown = useDropdown();

  return (
    <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
      {/* Batch action */}
      {onBatchStatusChange && (
        <div className="flex justify-start mb-1">
          <div className="relative" ref={batchDropdown.ref}>
            <button
              onClick={() => batchDropdown.setOpen(!batchDropdown.open)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-primary bg-primary/5 hover:bg-primary/10 rounded-lg transition-colors cursor-pointer"
            >
              שנה מצב לכולם
              <ChevronDown className={cn('w-3 h-3 transition-transform', batchDropdown.open && 'rotate-180')} />
            </button>
            {batchDropdown.open && (
              <div className="absolute top-full mt-1 start-0 z-40 bg-white rounded-lg shadow-xl border border-gray-200 py-1 min-w-[140px]">
                {statusOptions.map((s) => (
                  <button
                    key={s}
                    onClick={() => { onBatchStatusChange(s); batchDropdown.setOpen(false); }}
                    className="w-full px-3 py-1.5 text-xs text-start hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    {STATUS_LABELS[s]}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Inner table */}
      <table className="w-full text-sm">
        <thead>
          <tr className="text-xs text-text-secondary border-b border-slate-200">
            <th className="text-start py-1.5 px-3 font-semibold">ממונה</th>
            <th className="text-start py-1.5 px-3 font-semibold">מצב</th>
            <th className="text-start py-1.5 px-3 font-semibold">תאריך שיבוץ</th>
            {onAssigneeStatusChange && (
              <th className="text-start py-1.5 px-3 font-semibold">פעולות</th>
            )}
          </tr>
        </thead>
        <tbody>
          {assignees.map((assignee) => (
            <AssigneeRow
              key={assignee.id}
              assignee={assignee}
              onStatusChange={onAssigneeStatusChange}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function AssigneeRow({
  assignee,
  onStatusChange,
}: {
  assignee: InstructionAssignee;
  onStatusChange?: (assigneeId: string, status: InstructionStatus) => void;
}) {
  const dropdown = useDropdown();

  return (
    <tr className="border-t border-slate-100">
      <td className="py-2 px-3">
        <div className="flex items-center gap-2">
          <UserAvatar user={assignee.user} size={24} />
          <span className="font-medium text-text-primary">{assignee.user.name}</span>
        </div>
      </td>
      <td className="py-2 px-3">
        <StatusChip status={assignee.status} />
      </td>
      <td className="py-2 px-3 text-text-secondary">
        {formatDate(assignee.assignedAt)}
      </td>
      {onStatusChange && (
        <td className="py-2 px-3">
          <div className="relative" ref={dropdown.ref}>
            <button
              onClick={() => dropdown.setOpen(!dropdown.open)}
              className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-text-secondary hover:text-text-primary hover:bg-gray-100 rounded transition-colors cursor-pointer"
            >
              שנה מצב
              <ChevronDown className={cn('w-3 h-3 transition-transform', dropdown.open && 'rotate-180')} />
            </button>
            {dropdown.open && (
              <div className="absolute top-full mt-1 start-0 z-40 bg-white rounded-lg shadow-xl border border-gray-200 py-1 min-w-[130px]">
                {statusOptions.map((s) => (
                  <button
                    key={s}
                    onClick={() => { onStatusChange(assignee.id, s); dropdown.setOpen(false); }}
                    className={cn(
                      'w-full px-3 py-1.5 text-xs text-start hover:bg-gray-50 transition-colors cursor-pointer',
                      s === assignee.status && 'font-bold text-primary'
                    )}
                  >
                    {STATUS_LABELS[s]}
                  </button>
                ))}
              </div>
            )}
          </div>
        </td>
      )}
    </tr>
  );
}
