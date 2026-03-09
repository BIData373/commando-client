import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';
import { Tooltip, Checkbox } from '@/components/ui';
import {
  Columns3, Eye, EyeOff, MoreVertical, GripVertical,
  Edit, Archive, Trash2, Sparkles, Eye as EyeView,
  Users, ChevronUp, ChevronDown, MessageSquare, Link2,
  Flag,
} from 'lucide-react';
import { AssigneeSubTable } from './AssigneeSubTable';
import { ColumnHeaderCell } from './ColumnHeaderCell';
import { StatusChip } from './StatusChip';
import { UserAvatarGroup } from '@/components/common';
import { computeAggregatedStatus } from '@/lib/assigneeStatus';
import type { InstructionListItem, SortDirection, InstructionStatus } from '@/types';
import { DUE_DATE_TYPE_LABELS } from '@/types';

interface FilterOption {
  value: string;
  label: string;
}

export interface ColumnFilterOptions {
  assignees: FilterOption[];
  dueDate: FilterOption[];
  status: FilterOption[];
}

interface InstructionsTableProps {
  instructions: InstructionListItem[];
  sortState: { column: string | null; direction: SortDirection | null };
  onSort: (column: string) => void;
  columnFilters: Record<string, string[]>;
  filterOptions: ColumnFilterOptions;
  onFilterApply: (column: string, values: string[]) => void;
  onFilterReset: (column: string) => void;
  onViewInstruction: (instructionId: string) => void;
  onEditInstruction?: (instructionId: string) => void;
  onArchiveInstruction: (instructionId: string) => void;
  onRestoreInstruction?: (instructionId: string) => void;
  onDeleteInstruction: (instructionId: string) => void;
  onAssigneeStatusChange?: (instructionId: string, assigneeId: string, status: InstructionStatus) => void;
  onBatchStatusChange?: (instructionId: string, status: InstructionStatus) => void;
}

interface ColumnDef {
  id: string;
  label: string;
  sortable: boolean;
  filterable: boolean;
  defaultVisible: boolean;
  minWidth?: number;
}

const columns: ColumnDef[] = [
  { id: 'title', label: 'שם ההנחיה', sortable: false, filterable: false, defaultVisible: true, minWidth: 200 },
  { id: 'description', label: 'פירוט ההנחיה', sortable: false, filterable: false, defaultVisible: true, minWidth: 160 },
  { id: 'assignees', label: 'אחראים', sortable: false, filterable: true, defaultVisible: true, minWidth: 120 },
  { id: 'dueDate', label: 'תג״ב', sortable: true, filterable: true, defaultVisible: true, minWidth: 130 },
  { id: 'source', label: 'מקור', sortable: false, filterable: false, defaultVisible: true, minWidth: 140 },
  { id: 'notesLinks', label: 'הערות וקישורים', sortable: false, filterable: false, defaultVisible: true, minWidth: 120 },
  { id: 'createdAt', label: 'תאריך יצירה', sortable: true, filterable: false, defaultVisible: true, minWidth: 120 },
  { id: 'status', label: 'סטטוס', sortable: false, filterable: true, defaultVisible: true, minWidth: 110 },
  { id: 'updatedAt', label: 'עודכן ב', sortable: true, filterable: false, defaultVisible: true, minWidth: 120 },
  { id: 'actions', label: '', sortable: false, filterable: false, defaultVisible: true, minWidth: 48 },
];

function formatDate(date: Date | null): string {
  if (!date) return '—';
  return date.toLocaleDateString('he-IL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

function getDueDateDisplay(dueDate: Date | null): { text: string; color: string } | null {
  if (!dueDate) return null;
  const now = new Date();
  const diffMs = dueDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return { text: `חריגה ${Math.abs(diffDays)} ימים`, color: '#ef4444' };
  if (diffDays === 0) return { text: 'היום', color: '#f59e0b' };
  if (diffDays <= 7) return { text: `בעוד ${diffDays} ימים`, color: '#f59e0b' };
  return { text: `בעוד ${diffDays} ימים`, color: '#6b7280' };
}

function isNew(createdAt: Date): boolean {
  const twoDaysAgo = new Date();
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
  return createdAt > twoDaysAgo;
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

export function InstructionsTable({
  instructions,
  sortState,
  onSort,
  columnFilters,
  filterOptions,
  onFilterApply,
  onFilterReset,
  onViewInstruction,
  onEditInstruction,
  onArchiveInstruction,
  onRestoreInstruction,
  onDeleteInstruction,
  onAssigneeStatusChange,
  onBatchStatusChange,
}: InstructionsTableProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(
    new Set(columns.filter((c) => c.defaultVisible).map((c) => c.id))
  );
  const [columnOrder, setColumnOrder] = useState(columns);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const columnMenu = useDropdown();
  const [rowMenu, setRowMenu] = useState<{ id: string; rect: DOMRect } | null>(null);
  const rowMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!rowMenu) return;
    const handler = (e: MouseEvent) => {
      if (rowMenuRef.current && !rowMenuRef.current.contains(e.target as Node)) setRowMenu(null);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [rowMenu]);

  const handleSelectAll = (checked: boolean) => {
    setSelected(checked ? new Set(instructions.map((i) => i.id)) : new Set());
  };

  const handleSelectRow = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleColumn = (colId: string) => {
    setVisibleColumns((prev) => {
      const next = new Set(prev);
      if (next.has(colId)) {
        if (colId === 'title' || colId === 'actions') return prev;
        next.delete(colId);
      } else {
        next.add(colId);
      }
      return next;
    });
  };

  const toggleExpand = (id: string) => {
    setExpandedRows((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const activeColumns = columnOrder.filter((c) => visibleColumns.has(c.id));

  const handleColumnDragStart = (index: number) => setDragIndex(index);
  const handleColumnDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };
  const handleColumnDrop = (targetIndex: number) => {
    if (dragIndex === null || dragIndex === targetIndex) return;
    setColumnOrder((prev) => {
      const next = [...prev];
      const [moved] = next.splice(dragIndex, 1);
      next.splice(targetIndex, 0, moved);
      return next;
    });
    setDragIndex(null);
    setDragOverIndex(null);
  };
  const handleColumnDragEnd = () => {
    setDragIndex(null);
    setDragOverIndex(null);
  };

  const getFilterOptionsForColumn = (colId: string): FilterOption[] => {
    return (filterOptions as unknown as Record<string, FilterOption[]>)[colId] || [];
  };

  return (
    <div>
      {/* Column visibility toggle */}
      <div className="flex justify-end mb-2 relative" ref={columnMenu.ref}>
        <Tooltip content="הצג/הסתר עמודות טבלה">
          <button
            onClick={() => columnMenu.setOpen(!columnMenu.open)}
            className="p-1.5 rounded-md text-text-secondary hover:bg-gray-100 transition-colors cursor-pointer"
            aria-label="הצג/הסתר עמודות טבלה"
          >
            <Columns3 className="w-4 h-4" />
          </button>
        </Tooltip>
        {columnMenu.open && (
          <div className="absolute top-8 end-0 z-30 bg-paper rounded-lg shadow-xl border border-gray-200 py-1 min-w-[220px]">
            {columnOrder
              .filter((c) => c.id !== 'actions')
              .map((col, idx) => {
                const isDraggable = col.id !== 'title';
                return (
                  <div
                    key={col.id}
                    draggable={isDraggable}
                    onDragStart={() => isDraggable && handleColumnDragStart(idx)}
                    onDragOver={(e) => isDraggable && handleColumnDragOver(e, idx)}
                    onDrop={() => isDraggable && handleColumnDrop(idx)}
                    onDragEnd={handleColumnDragEnd}
                    className={cn(
                      'flex items-center gap-2 w-full px-3 py-2 text-sm text-start transition-colors',
                      col.id === 'title' ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50 cursor-grab group/drag',
                      dragIndex === idx && 'opacity-40',
                      dragOverIndex === idx && dragIndex !== idx && 'border-t-2 border-primary',
                    )}
                  >
                    {isDraggable ? (
                      <GripVertical className="w-3.5 h-3.5 text-text-disabled shrink-0 opacity-0 group-hover/drag:opacity-100 transition-opacity" />
                    ) : (
                      <span className="w-3.5 shrink-0" />
                    )}
                    <button
                      onClick={() => toggleColumn(col.id)}
                      disabled={col.id === 'title'}
                      className="flex items-center gap-2 flex-1 cursor-pointer"
                    >
                      {visibleColumns.has(col.id) ? (
                        <Eye className="w-4 h-4 text-text-secondary" />
                      ) : (
                        <EyeOff className="w-4 h-4 text-text-disabled" />
                      )}
                      <span>{col.label}</span>
                    </button>
                  </div>
                );
              })}
          </div>
        )}
      </div>

      <div className="bg-paper rounded-lg shadow-card overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="bg-gray-50">
              <th className="w-12 px-3 py-3">
                <Checkbox
                  checked={instructions.length > 0 && selected.size === instructions.length}
                  indeterminate={selected.size > 0 && selected.size < instructions.length}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  aria-label="סמן הכל"
                />
              </th>
              {activeColumns.map((col) =>
                col.id === 'actions' ? (
                  <th
                    key={col.id}
                    className="px-3 py-3 text-start text-xs font-semibold text-text-secondary whitespace-nowrap"
                    style={{ minWidth: col.minWidth }}
                  />
                ) : (
                  <ColumnHeaderCell
                    key={col.id}
                    label={col.label}
                    minWidth={col.minWidth}
                    sortable={col.sortable}
                    filterable={col.filterable}
                    sortState={sortState}
                    columnId={col.id}
                    filterValues={columnFilters[col.id] || []}
                    filterOptions={getFilterOptionsForColumn(col.id)}
                    onSort={() => onSort(col.id)}
                    onFilterApply={(values) => onFilterApply(col.id, values)}
                    onFilterReset={() => onFilterReset(col.id)}
                  />
                )
              )}
            </tr>
          </thead>
          <tbody>
            {instructions.map((instruction) => (
              <React.Fragment key={instruction.id}>
                <tr
                  className={cn(
                    'border-t border-gray-100 cursor-pointer transition-colors hover:bg-gray-50',
                    selected.has(instruction.id) && 'bg-primary/5'
                  )}
                >
                  <td className="px-3 py-2.5">
                    <Checkbox
                      checked={selected.has(instruction.id)}
                      onChange={() => handleSelectRow(instruction.id)}
                      onClick={(e) => e.stopPropagation()}
                      aria-label={`בחר ${instruction.title}`}
                    />
                  </td>

                  {activeColumns.map((col) => (
                    <td key={col.id} className="px-3 py-2.5">
                      {/* Notes & Links */}
                      {col.id === 'notesLinks' && (
                        <div className="flex items-center gap-2">
                          {instruction.commentCount > 0 && (
                            <Tooltip content={`${instruction.commentCount} הערות`}>
                              <span className="inline-flex items-center gap-1 text-xs text-text-secondary">
                                <MessageSquare className="w-3.5 h-3.5" />
                                {instruction.commentCount}
                              </span>
                            </Tooltip>
                          )}
                          {instruction.source && (
                            <Tooltip content={instruction.source}>
                              <span className="text-text-secondary">
                                <Link2 className="w-3.5 h-3.5" />
                              </span>
                            </Tooltip>
                          )}
                          {!instruction.commentCount && !instruction.source && (
                            <span className="text-text-disabled">—</span>
                          )}
                        </div>
                      )}

                      {/* Title — clickable to open view modal */}
                      {col.id === 'title' && (
                        <div className="flex items-center gap-2">
                          {instruction.isImportant && (
                            <Tooltip content="הנחיה חשובה">
                              <Flag className="w-4 h-4 text-amber-500 fill-amber-500 shrink-0" />
                            </Tooltip>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onViewInstruction(instruction.id);
                            }}
                            className="text-sm font-semibold text-text-primary hover:text-primary transition-colors cursor-pointer text-start"
                          >
                            {instruction.title}
                          </button>
                          {isNew(instruction.createdAt) && (
                            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[0.7rem] font-semibold rounded bg-info-light text-info">
                              <Sparkles className="w-3 h-3" />
                              חדש
                            </span>
                          )}
                        </div>
                      )}

                      {/* Description */}
                      {col.id === 'description' && (
                        <span className="text-sm text-text-secondary line-clamp-2">
                          {instruction.description || '—'}
                        </span>
                      )}

                      {/* Assignees */}
                      {col.id === 'assignees' && (
                        instruction.assignees.length > 1 ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleExpand(instruction.id);
                            }}
                            className="flex items-center gap-1.5 text-sm text-primary hover:text-primary/80 transition-colors cursor-pointer"
                          >
                            <Users className="w-4 h-4" />
                            <span>מספר ממונים ({instruction.assignees.length})</span>
                            {expandedRows.has(instruction.id)
                              ? <ChevronUp className="w-3.5 h-3.5" />
                              : <ChevronDown className="w-3.5 h-3.5" />
                            }
                          </button>
                        ) : (
                          <UserAvatarGroup
                            users={instruction.assignees.map((a) => a.user)}
                            max={3}
                            size={28}
                          />
                        )
                      )}

                      {/* Due date */}
                      {col.id === 'dueDate' &&
                        (() => {
                          const display = getDueDateDisplay(instruction.dueDate);

                          // "תאריך" type — just show date range, no badge
                          if (instruction.dueDateType === 'date') {
                            return (
                              <div className="flex flex-col gap-1">
                                <span className="text-sm">
                                  {formatDate(instruction.dueDate)}
                                </span>
                                {display && instruction.status !== 'completed' && (
                                  <span className="text-xs font-medium" style={{ color: display.color }}>
                                    {display.text}
                                  </span>
                                )}
                              </div>
                            );
                          }

                          // "שוטף" / "מיידי" — show badge + date
                          const typeLabel = DUE_DATE_TYPE_LABELS[instruction.dueDateType] || 'שוטף';
                          const typeBadgeColor =
                            instruction.dueDateType === 'immediate'
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-blue-100 text-blue-700';
                          return (
                            <div className="flex flex-col gap-1">
                              <div className="flex items-center gap-1.5">
                                <span className={cn('inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium', typeBadgeColor)}>
                                  {typeLabel}
                                </span>
                                {instruction.dueDate && (
                                  <span className="text-sm">
                                    {formatDate(instruction.dueDate)}
                                  </span>
                                )}
                              </div>
                              {display && instruction.status !== 'completed' && (
                                <span
                                  className="text-xs font-medium"
                                  style={{ color: display.color }}
                                >
                                  {display.text}
                                </span>
                              )}
                            </div>
                          );
                        })()}

                      {/* Status */}
                      {col.id === 'status' && (() => {
                        const agg = computeAggregatedStatus(instruction.assignees);
                        return (
                          <div className="flex items-center gap-1.5">
                            <StatusChip status={agg.overall} />
                            {agg.progressLabel && (
                              <span className="text-[0.65rem] text-text-disabled">{agg.progressLabel}</span>
                            )}
                          </div>
                        );
                      })()}

                      {/* Created At */}
                      {col.id === 'createdAt' && (
                        <span className="text-sm text-text-secondary">
                          {formatDate(instruction.createdAt)}
                        </span>
                      )}

                      {/* Updated At */}
                      {col.id === 'updatedAt' && (
                        <span className="text-sm text-text-secondary">
                          {formatDate(instruction.updatedAt)}
                        </span>
                      )}

                      {/* Source */}
                      {col.id === 'source' && (
                        <span className="text-sm text-text-secondary truncate max-w-[200px] block">
                          {instruction.source || '—'}
                        </span>
                      )}

                      {/* Row Action Menu */}
                      {col.id === 'actions' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const rect = e.currentTarget.getBoundingClientRect();
                            setRowMenu(rowMenu?.id === instruction.id ? null : { id: instruction.id, rect });
                          }}
                          className={cn(
                            'p-1 rounded transition-colors cursor-pointer',
                            rowMenu?.id === instruction.id
                              ? 'bg-gray-200 text-text-primary'
                              : 'hover:bg-gray-100 text-text-secondary'
                          )}
                          aria-label="פעולות"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  ))}
                </tr>
                {expandedRows.has(instruction.id) && instruction.assignees.length > 1 && (
                  <tr className="bg-slate-50/50">
                    <td colSpan={activeColumns.length + 1} className="px-6 py-3">
                      <AssigneeSubTable
                        assignees={instruction.assignees}
                        onAssigneeStatusChange={onAssigneeStatusChange
                          ? (assigneeId, status) => onAssigneeStatusChange(instruction.id, assigneeId, status)
                          : undefined
                        }
                        onBatchStatusChange={onBatchStatusChange
                          ? (status) => onBatchStatusChange(instruction.id, status)
                          : undefined
                        }
                      />
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Row action menu — rendered via portal outside the table */}
      {rowMenu && (() => {
        const inst = instructions.find((i) => i.id === rowMenu.id);
        if (!inst) return null;
        return createPortal(
          <div
            ref={rowMenuRef}
            className="fixed z-50 bg-paper rounded-lg shadow-xl border border-gray-200 py-1 min-w-[160px]"
            style={{ top: rowMenu.rect.bottom + 4, left: rowMenu.rect.left }}
          >
            <button
              onClick={() => { onViewInstruction(inst.id); setRowMenu(null); }}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-gray-50 text-start cursor-pointer"
            >
              <EyeView className="w-4 h-4" /> צפייה
            </button>
            <button
              onClick={() => { if (onEditInstruction) onEditInstruction(inst.id); setRowMenu(null); }}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-gray-50 text-start cursor-pointer"
            >
              <Edit className="w-4 h-4" /> עדכון
            </button>
            <hr className="my-1 border-gray-200" />
            {inst.status === 'archived' && onRestoreInstruction ? (
              <button
                onClick={() => { onRestoreInstruction(inst.id); setRowMenu(null); }}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-gray-50 text-start cursor-pointer text-emerald-600"
              >
                <Archive className="w-4 h-4" /> שחזור מארכיון
              </button>
            ) : (
              <button
                onClick={() => { onArchiveInstruction(inst.id); setRowMenu(null); }}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-gray-50 text-start cursor-pointer"
              >
                <Archive className="w-4 h-4" /> העברה לארכיון
              </button>
            )}
            <button
              onClick={() => { onDeleteInstruction(inst.id); setRowMenu(null); }}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-error hover:bg-error-light/50 text-start cursor-pointer"
            >
              <Trash2 className="w-4 h-4" /> ביטול
            </button>
          </div>,
          document.body
        );
      })()}
    </div>
  );
}
