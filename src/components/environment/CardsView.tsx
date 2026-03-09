import { useMemo, useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { StatusChip, PriorityChip } from './StatusChip';
import { UserAvatarGroup } from '@/components/common';
import { MoreVertical, Eye, Archive, Flag } from 'lucide-react';
import {
  STATUS_LABELS,
  STATUS_COLORS,
  type InstructionListItem,
  type InstructionStatus,
} from '@/types';

interface CardsViewProps {
  instructions: InstructionListItem[];
  envId: string;
  onViewInstruction?: (id: string) => void;
  onArchiveInstruction?: (id: string) => void;
  onRestoreInstruction?: (id: string) => void;
}

type GroupBy = 'status' | 'assignee' | 'source';

interface GroupedColumn {
  key: string;
  label: string;
  color: string;
  items: InstructionListItem[];
}

function formatDate(date: Date | null): string {
  if (!date) return '—';
  return date.toLocaleDateString('he-IL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

function getDueDateColor(dueDate: Date | null, status: InstructionStatus): string {
  if (!dueDate || status === 'completed' || status === 'archived') return '#6b7280';
  const diffDays = Math.ceil((dueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  if (diffDays < 0) return '#ef4444';
  if (diffDays <= 3) return '#f59e0b';
  return '#6b7280';
}

function groupByStatus(instructions: InstructionListItem[]): GroupedColumn[] {
  const statusOrder: InstructionStatus[] = ['open', 'in_progress', 'completed', 'archived'];
  return statusOrder.map((status) => ({
    key: status,
    label: STATUS_LABELS[status],
    color: STATUS_COLORS[status],
    items: instructions.filter((i) => i.status === status),
  }));
}

function groupByAssignee(instructions: InstructionListItem[]): GroupedColumn[] {
  const map = new Map<string, { label: string; items: InstructionListItem[] }>();
  const colors = ['#3f51b5', '#7c4dff', '#e91e63', '#009688', '#ff5722', '#795548'];

  instructions.forEach((inst) => {
    if (inst.assignees.length === 0) {
      const existing = map.get('unassigned');
      if (existing) existing.items.push(inst);
      else map.set('unassigned', { label: 'ללא ממונה', items: [inst] });
    } else {
      inst.assignees.forEach((a) => {
        const existing = map.get(a.user.id);
        if (existing) {
          if (!existing.items.find((x) => x.id === inst.id)) existing.items.push(inst);
        } else {
          map.set(a.user.id, { label: a.user.name, items: [inst] });
        }
      });
    }
  });

  let idx = 0;
  return Array.from(map.entries()).map(([key, val]) => ({
    key,
    label: val.label,
    color: colors[idx++ % colors.length],
    items: val.items,
  }));
}

function groupBySource(instructions: InstructionListItem[]): GroupedColumn[] {
  const map = new Map<string, InstructionListItem[]>();
  const colors = ['#06b6d4', '#8b5cf6', '#f59e0b', '#10b981', '#ef4444'];

  instructions.forEach((inst) => {
    const src = inst.source || 'ללא גורם מפקד';
    const existing = map.get(src);
    if (existing) existing.push(inst);
    else map.set(src, [inst]);
  });

  let idx = 0;
  return Array.from(map.entries()).map(([key, items]) => ({
    key,
    label: key,
    color: colors[idx++ % colors.length],
    items,
  }));
}

const groupOptions: { value: GroupBy; label: string }[] = [
  { value: 'status', label: 'מצב' },
  { value: 'assignee', label: 'ממונה' },
  { value: 'source', label: 'גורם מפקד' },
];

export function CardsView({ instructions, envId, onViewInstruction, onArchiveInstruction, onRestoreInstruction }: CardsViewProps) {
  const navigate = useNavigate();
  const [groupBy, setGroupBy] = useState<GroupBy>('status');
  const [cardMenu, setCardMenu] = useState<{ id: string; rect: DOMRect } | null>(null);
  const cardMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cardMenu) return;
    const handler = (e: MouseEvent) => {
      if (cardMenuRef.current && !cardMenuRef.current.contains(e.target as Node)) setCardMenu(null);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [cardMenu]);

  const groupedColumns = useMemo(() => {
    switch (groupBy) {
      case 'status':
        return groupByStatus(instructions);
      case 'assignee':
        return groupByAssignee(instructions);
      case 'source':
        return groupBySource(instructions);
    }
  }, [instructions, groupBy]);

  const handleCardClick = (instruction: InstructionListItem) => {
    if (onViewInstruction) {
      onViewInstruction(instruction.id);
    } else {
      navigate(`/env/${envId}/i/${instruction.id}`);
    }
  };

  return (
    <>
    <div>
      {/* Grouping toggle */}
      <div className="flex items-center gap-3 mb-4">
        <span className="text-sm text-text-secondary font-medium">קיבוץ לפי:</span>
        <div className="inline-flex rounded-lg border border-gray-200 overflow-hidden">
          {groupOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setGroupBy(opt.value)}
              className={cn(
                'px-3 py-1.5 text-sm font-medium transition-colors cursor-pointer',
                groupBy === opt.value
                  ? 'bg-primary/10 text-primary'
                  : 'text-text-secondary hover:bg-gray-50'
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Kanban columns */}
      <div className="flex gap-3 overflow-x-auto pb-3 min-h-[400px]">
        {groupedColumns.map((column) => (
          <div
            key={column.key}
            className="min-w-[300px] max-w-[340px] shrink-0 flex flex-col"
          >
            {/* Column header */}
            <div className="flex items-center gap-2 mb-3 px-1">
              <div
                className="w-3 h-3 rounded-full shrink-0"
                style={{ backgroundColor: column.color }}
              />
              <span className="text-sm font-semibold text-text-primary">
                {column.label}
              </span>
              <span className="text-xs font-semibold text-text-secondary bg-gray-100 rounded-full px-2 py-0.5">
                {column.items.length}
              </span>
            </div>

            {/* Cards */}
            <div className="flex-1 bg-gray-50 rounded-lg p-3 flex flex-col gap-3 min-h-[100px]">
              {column.items.length === 0 && (
                <div className="py-8 text-center">
                  <span className="text-xs text-text-disabled">אין הנחיות</span>
                </div>
              )}

              {column.items.map((instruction) => (
                <div
                  key={instruction.id}
                  onClick={() => handleCardClick(instruction)}
                  className="bg-paper rounded-lg shadow-card hover:shadow-hover hover:-translate-y-px transition-all cursor-pointer text-start p-3"
                >
                  {/* Priority + Status + Menu */}
                  <div className="flex justify-between items-start mb-2">
                    <PriorityChip priority={instruction.priority} />
                    <div className="flex items-center gap-1">
                      <StatusChip status={instruction.status} />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const rect = e.currentTarget.getBoundingClientRect();
                          setCardMenu(cardMenu?.id === instruction.id ? null : { id: instruction.id, rect });
                        }}
                        className={cn(
                          'p-1 rounded transition-colors cursor-pointer',
                          cardMenu?.id === instruction.id
                            ? 'bg-gray-200 text-text-primary'
                            : 'hover:bg-gray-100 text-text-secondary'
                        )}
                        aria-label="פעולות"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Title */}
                  <div className="flex items-start gap-1.5 mb-2">
                    {instruction.isImportant && (
                      <Flag className="w-4 h-4 text-amber-500 fill-amber-500 shrink-0 mt-0.5" />
                    )}
                    <p className="text-sm font-semibold text-text-primary leading-relaxed line-clamp-2">
                      {instruction.title}
                    </p>
                  </div>

                  {/* Assignees */}
                  {instruction.assignees.length > 0 && (
                    <div className="mb-2">
                      <UserAvatarGroup
                        users={instruction.assignees.map((a) => a.user)}
                        max={3}
                        size={26}
                      />
                    </div>
                  )}

                  {/* Bottom row: due date */}
                  {instruction.dueDate && (
                    <div className="mt-1">
                      <span
                        className="text-xs font-medium"
                        style={{ color: getDueDateColor(instruction.dueDate, instruction.status) }}
                      >
                        תג״ב: {formatDate(instruction.dueDate)}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Card action menu — rendered via portal */}
    {cardMenu && (() => {
      const inst = instructions.find((i) => i.id === cardMenu.id);
      if (!inst) return null;
      return createPortal(
        <div
          ref={cardMenuRef}
          className="fixed z-50 bg-paper rounded-lg shadow-xl border border-gray-200 py-1 min-w-[160px]"
          style={{ top: cardMenu.rect.bottom + 4, left: cardMenu.rect.left }}
        >
          <button
            onClick={() => { handleCardClick(inst); setCardMenu(null); }}
            className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-gray-50 text-start cursor-pointer"
          >
            <Eye className="w-4 h-4" /> צפה בהנחיה
          </button>
          <div className="border-t border-gray-100 my-1" />
          {inst.status === 'archived' ? (
            onRestoreInstruction && (
              <button
                onClick={() => { onRestoreInstruction(inst.id); setCardMenu(null); }}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-gray-50 text-start cursor-pointer text-emerald-600"
              >
                <Archive className="w-4 h-4" /> שחזור מארכיון
              </button>
            )
          ) : (
            onArchiveInstruction && (
              <button
                onClick={() => { onArchiveInstruction(inst.id); setCardMenu(null); }}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-gray-50 text-start cursor-pointer text-amber-600"
              >
                <Archive className="w-4 h-4" /> העברה לארכיון
              </button>
            )
          )}
        </div>,
        document.body
      );
    })()}
    </>
  );
}
