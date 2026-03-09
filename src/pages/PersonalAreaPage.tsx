import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Tooltip, Checkbox } from '@/components/ui';
import {
  Search, X, Download, Table2, LayoutGrid,
  Columns3, Eye, EyeOff, ChevronUp, ChevronDown, GripVertical,
  MoreVertical, Edit, FolderInput, Archive,
  Sparkles, MessageCircle, MessageSquare, AlertTriangle,
  Link2, Flag,
} from 'lucide-react';
import { StatusChip, PriorityChip } from '@/components/environment/StatusChip';
import { UserAvatarGroup } from '@/components/common';
import { PersonalTopbar } from '@/components/personal/PersonalTopbar';
import { exportToCsv } from '@/lib/exportCsv';
import {
  getMyInstructions,
  getMyStats,
} from '@/mocks/data';
import { InstructionViewModal } from '@/components/environment/InstructionViewModal';
import type {
  InstructionListItem,
  InstructionStatus,
  InstructionStats,
  SortDirection,
} from '@/types';
import {
  STATUS_LABELS,
  STATUS_COLORS,
} from '@/types';

// ─── Types ───
interface PersonalInstruction extends InstructionListItem {
  environmentName: string;
}

type ViewMode = 'table' | 'cards';
type StatusTab = 'all' | 'open' | 'in_progress' | 'completed' | 'archived';
type QuickFilter = 'all' | 'overdue' | 'routine' | 'important';

// ─── Mock current user ───
const CURRENT_USER = {
  id: 'u1-aaaa-bbbb-cccc-dddddddddddd',
  name: 'סא"ל כהן',
};

// ─── Data loading (mock) ───
function usePersonalData() {
  const rawItems = useMemo(() => getMyInstructions(), []);
  const rawStats = useMemo(() => getMyStats(), []);

  const instructions: PersonalInstruction[] = useMemo(
    () =>
      rawItems.map((item) => ({
        id: item.id,
        environmentId: item.environment_id,
        title: item.title,
        description: item.description,
        status: item.status as InstructionStatus,
        priority: item.priority as PersonalInstruction['priority'],
        dueDateType: (item.due_date_type as 'routine' | 'immediate' | 'date') || 'routine',
        dueDateFrom: item.due_date_from ? new Date(item.due_date_from) : null,
        dueDate: item.due_date ? new Date(item.due_date) : null,
        source: item.source,
        assignees: item.assignees.map((a) => ({
          id: a.id,
          user: { id: a.user.id, name: a.user.name, avatarUrl: a.user.avatar_url },
          assignedAt: new Date(a.assigned_at),
          assignedBy: a.assigned_by
            ? { id: a.assigned_by.id, name: a.assigned_by.name, avatarUrl: a.assigned_by.avatar_url }
            : null,
          status: a.status as InstructionStatus,
        })),
        tags: item.tags.map((t) => ({
          id: t.id,
          environmentId: t.environment_id,
          name: t.name,
          color: t.color,
          createdAt: new Date(t.created_at),
        })),
        commentCount: item.comment_count,
        createdAt: new Date(item.created_at),
        updatedAt: new Date(item.updated_at),
        isImportant: item.is_important ?? false,
        environmentName: item.environment_name,
      })),
    [rawItems]
  );

  const stats: InstructionStats = useMemo(
    () => ({
      total: rawStats.total,
      open: rawStats.open,
      inProgress: rawStats.in_progress,
      completed: rawStats.completed,
      archived: rawStats.archived,
      overdue: rawStats.overdue,
      urgent: rawStats.urgent,
      dueSoon: rawStats.due_soon,
    }),
    [rawStats]
  );

  return { instructions, stats };
}

// ─── Helpers ───
function formatDate(date: Date | null): string {
  if (!date) return '—';
  return date.toLocaleDateString('he-IL', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function getDueDateDisplay(dueDate: Date | null, status: InstructionStatus) {
  if (!dueDate || status === 'completed' || status === 'archived') return null;
  const now = new Date();
  const diffMs = dueDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays < 0) return { text: `חריגה ${Math.abs(diffDays)} ימים`, color: '#ef4444', overdue: true };
  if (diffDays === 0) return { text: 'היום', color: '#f59e0b', overdue: false };
  if (diffDays <= 7) return { text: `בעוד ${diffDays} ימים`, color: '#f59e0b', overdue: false };
  return { text: `בעוד ${diffDays} ימים`, color: '#6b7280', overdue: false };
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

// ═══════════════════════════════════════
// Main Page
// ═══════════════════════════════════════
export function PersonalAreaPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [activeTab, setActiveTab] = useState<StatusTab>('all');
  const [quickFilter, setQuickFilter] = useState<QuickFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [envFilter, setEnvFilter] = useState<string>('all');

  const [viewModal, setViewModal] = useState<{ instructionId: string; envId: string } | null>(null);

  const { instructions: rawInstructions, stats } = usePersonalData();

  // Local archive state (mock — in prod this would be a mutation)
  const [statusOverrides, setStatusOverrides] = useState<Record<string, InstructionStatus>>({});
  const instructions = useMemo(
    () => rawInstructions.map((i) => statusOverrides[i.id] ? { ...i, status: statusOverrides[i.id] } : i),
    [rawInstructions, statusOverrides]
  );

  const handleArchive = useCallback((id: string) => {
    setStatusOverrides((prev) => ({ ...prev, [id]: 'archived' }));
  }, []);

  const handleRestore = useCallback((id: string) => {
    setStatusOverrides((prev) => ({ ...prev, [id]: 'open' }));
  }, []);

  const handleViewInstruction = useCallback((instructionId: string, envId: string) => {
    setViewModal({ instructionId, envId });
  }, []);

  // ── Unique environments for filter ──
  const envOptions = useMemo(() => {
    const envs = new Map<string, string>();
    instructions.forEach((i) => envs.set(i.environmentId, i.environmentName));
    return Array.from(envs, ([id, name]) => ({ id, name }));
  }, [instructions]);

  const [dueDateFilter, setDueDateFilter] = useState<string>('all');

  // ── Client-side filtering ──
  const filteredInstructions = useMemo(() => {
    let items = [...instructions];
    const now = new Date();

    // Status tab
    if (activeTab === 'archived') {
      items = items.filter((i) => i.status === 'archived');
    } else if (activeTab !== 'all') {
      items = items.filter((i) => i.status === activeTab);
    } else {
      // "all" — exclude archived
      items = items.filter((i) => i.status !== 'archived');
    }

    // Quick filter
    if (quickFilter === 'overdue') {
      items = items.filter(
        (i) => i.dueDate && i.dueDate.getTime() < now.getTime() && i.status !== 'completed' && i.status !== 'archived'
      );
    } else if (quickFilter === 'routine') {
      items = items.filter((i) => i.dueDateType === 'routine');
    } else if (quickFilter === 'important') {
      items = items.filter((i) => i.priority === 'high' || i.priority === 'urgent' || i.isImportant);
    }

    // Environment filter
    if (envFilter !== 'all') {
      items = items.filter((i) => i.environmentId === envFilter);
    }

    // Due date type filter
    if (dueDateFilter !== 'all') {
      items = items.filter((i) => i.dueDateType === dueDateFilter);
    }

    // Text search
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      items = items.filter((i) => {
        return (
          i.title.toLowerCase().includes(q) ||
          i.source?.toLowerCase().includes(q) ||
          i.environmentName.toLowerCase().includes(q) ||
          i.assignees.some((a) => a.user.name.toLowerCase().includes(q))
        );
      });
    }

    return items;
  }, [instructions, activeTab, quickFilter, searchQuery, envFilter, dueDateFilter]);

  const handleQuickFilterChange = useCallback((filter: QuickFilter) => {
    setQuickFilter(filter);
  }, []);

  // ── Export ──
  const handleExport = () => {
    const headers = ['שם', 'תאריך הפקה', 'תג״ב', 'ממונה', 'מצב', 'מערך', 'גורם מפקד'];
    const rows = filteredInstructions.map((i) => [
      i.title,
      formatDate(i.createdAt),
      formatDate(i.dueDate),
      i.assignees.map((a) => a.user.name).join(', '),
      STATUS_LABELS[i.status],
      i.environmentName,
      i.source || '',
    ]);
    exportToCsv(headers, rows, `הנחיות_${formatDate(new Date())}.csv`);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <PersonalTopbar
        activeItem="instructions"
        onItemChange={() => {}}
        userName={CURRENT_USER.name}
      />

          {/* Secondary Bar: title (right) + search & export (left) */}
          <div className="bg-paper border-b border-gray-200">
            <div className="flex items-center justify-between px-6 py-2.5 gap-4">
              {/* Right side (RTL start): Title */}
              <h1 className="text-[30px] font-bold text-text-primary">ההנחיות שלי</h1>

              {/* Left side (RTL end): Search + Export */}
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-disabled" />
                  <input
                    type="text"
                    placeholder="חיפוש..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-[220px] ps-9 pe-8 py-1.5 text-sm rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 focus:bg-paper focus:outline-none focus:ring-2 focus:ring-primary/30 transition-colors"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute end-2 top-1/2 -translate-y-1/2 text-text-disabled hover:text-text-secondary cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <Tooltip content="ייצוא לאקסל">
                  <button
                    onClick={handleExport}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer text-text-secondary"
                  >
                    <Download className="w-4 h-4" />
                    ייצוא
                  </button>
                </Tooltip>
              </div>
            </div>
          </div>

          {/* KPI Bar */}
          <KpiBar stats={stats} />

          {/* Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            {/* Filters + View toggle */}
            <div className="mb-4">
              <FiltersBar
                activeTab={activeTab}
                onTabChange={setActiveTab}
                quickFilter={quickFilter}
                onQuickFilterChange={handleQuickFilterChange}
                envFilter={envFilter}
                onEnvFilterChange={setEnvFilter}
                envOptions={envOptions}
                dueDateFilter={dueDateFilter}
                onDueDateFilterChange={setDueDateFilter}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
              />
            </div>

            {filteredInstructions.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-text-secondary text-sm">לא נמצאו הנחיות תואמות</p>
              </div>
            ) : (
              <>
                {viewMode === 'table' && (
                  <PersonalTable instructions={filteredInstructions} onArchive={handleArchive} onRestore={handleRestore} onViewInstruction={handleViewInstruction} />
                )}
                {viewMode === 'cards' && (
                  <PersonalCards instructions={filteredInstructions} onViewInstruction={handleViewInstruction} onArchive={handleArchive} onRestore={handleRestore} />
                )}
              </>
            )}
          </div>

{/* Instruction View Modal */}
      {viewModal && (
        <InstructionViewModal
          open
          onClose={() => setViewModal(null)}
          instructionId={viewModal.instructionId}
          envId={viewModal.envId}
        />
      )}
    </div>
  );
}

// ═══════════════════════════════════════
// KPI Bar
// ═══════════════════════════════════════
function KpiBar({ stats }: { stats: InstructionStats }) {
  const items = [
    { label: 'סה"כ', value: stats.total, color: '#6366f1' },
    { label: 'ממתינות', value: stats.open, color: STATUS_COLORS.open },
    { label: 'בביצוע', value: stats.inProgress, color: STATUS_COLORS.in_progress },
    { label: 'בוצעו', value: stats.completed, color: STATUS_COLORS.completed },
    { label: 'חריגות', value: stats.overdue, color: '#ef4444' },
    { label: 'ארכיון', value: stats.archived, color: '#9ca3af' },
  ];

  return (
    <div className="bg-paper border-b border-gray-100 px-6 py-3">
      <div className="flex items-center gap-6">
        {items.map((item) => (
          <div key={item.label} className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
            <span className="text-xs text-text-secondary">{item.label}</span>
            <span className="text-sm font-bold text-text-primary">{item.value}</span>
          </div>
        ))}

        {/* Progress bar */}
        {stats.total > 0 && (
          <div className="flex-1 flex items-center gap-3 ms-4">
            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden flex">
              {stats.completed > 0 && (
                <div
                  className="h-full rounded-full"
                  style={{ width: `${(stats.completed / stats.total) * 100}%`, backgroundColor: STATUS_COLORS.completed }}
                />
              )}
              {stats.inProgress > 0 && (
                <div
                  className="h-full"
                  style={{ width: `${(stats.inProgress / stats.total) * 100}%`, backgroundColor: STATUS_COLORS.in_progress }}
                />
              )}
              {stats.open > 0 && (
                <div
                  className="h-full"
                  style={{ width: `${(stats.open / stats.total) * 100}%`, backgroundColor: STATUS_COLORS.open }}
                />
              )}
            </div>
            <span className="text-xs text-text-secondary whitespace-nowrap">
              {Math.round((stats.completed / stats.total) * 100)}% בוצע
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════
// Filters Bar
// ═══════════════════════════════════════
interface FiltersBarProps {
  activeTab: StatusTab;
  onTabChange: (tab: StatusTab) => void;
  quickFilter: QuickFilter;
  onQuickFilterChange: (f: QuickFilter) => void;
  envFilter: string;
  onEnvFilterChange: (v: string) => void;
  envOptions: { id: string; name: string }[];
  dueDateFilter: string;
  onDueDateFilterChange: (v: string) => void;
  viewMode: ViewMode;
  onViewModeChange: (v: ViewMode) => void;
}

const STATUS_TABS: { value: StatusTab; label: string }[] = [
  { value: 'all', label: 'הכל' },
  { value: 'open', label: 'ממתין לביצוע' },
  { value: 'in_progress', label: 'בביצוע' },
  { value: 'completed', label: 'בוצע' },
  { value: 'archived', label: 'ארכיון' },
];

const QUICK_FILTERS: { value: QuickFilter; label: string }[] = [
  { value: 'all', label: 'הכול' },
  { value: 'overdue', label: 'חריגה מתג״ב' },
  { value: 'routine', label: 'הנחיות שוטפות' },
  { value: 'important', label: 'הנחיות חשובות' },
];

function FiltersBar({
  activeTab, onTabChange,
  quickFilter, onQuickFilterChange,
  envFilter, onEnvFilterChange, envOptions,
  dueDateFilter, onDueDateFilterChange,
  viewMode, onViewModeChange,
}: FiltersBarProps) {
  return (
    <div className="space-y-3">
      {/* Status tabs */}
      <div className="flex items-center justify-between">
        <div className="flex gap-1">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => onTabChange(tab.value)}
              className={cn(
                'px-3.5 py-1.5 text-sm font-medium rounded-lg transition-colors cursor-pointer',
                activeTab === tab.value
                  ? 'bg-primary text-white'
                  : 'text-text-secondary hover:bg-gray-100'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* View mode toggle */}
        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-0.5">
          {([
            { key: 'table' as ViewMode, icon: <Table2 className="w-4 h-4" />, label: 'טבלה' },
            { key: 'cards' as ViewMode, icon: <LayoutGrid className="w-4 h-4" />, label: 'כרטיסיות' },
          ]).map((v) => (
            <Tooltip key={v.key} content={v.label}>
              <button
                onClick={() => onViewModeChange(v.key)}
                className={cn(
                  'p-1.5 rounded-md transition-colors cursor-pointer',
                  viewMode === v.key ? 'bg-white shadow-sm text-primary' : 'text-text-secondary hover:text-text-primary'
                )}
              >
                {v.icon}
              </button>
            </Tooltip>
          ))}
        </div>
      </div>

      {/* Quick filters + dropdowns */}
      <div className="flex items-center gap-2 flex-wrap">
        {QUICK_FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => onQuickFilterChange(f.value)}
            className={cn(
              'px-3 py-1 text-xs font-semibold rounded-full border transition-colors cursor-pointer',
              quickFilter === f.value
                ? 'bg-primary text-white border-primary'
                : 'bg-white text-text-secondary border-gray-200 hover:bg-gray-50'
            )}
          >
            {f.label}
          </button>
        ))}

        <span className="w-px h-5 bg-gray-200 mx-1" />

        {/* Environment filter */}
        <select
          value={envFilter}
          onChange={(e) => onEnvFilterChange(e.target.value)}
          className="text-xs border border-gray-200 rounded-lg px-2.5 py-1 bg-white text-text-secondary cursor-pointer outline-none focus:ring-2 focus:ring-primary/30"
        >
          <option value="all">כל המערכים</option>
          {envOptions.map((e) => (
            <option key={e.id} value={e.id}>{e.name}</option>
          ))}
        </select>

        {/* Due date type filter */}
        <select
          value={dueDateFilter}
          onChange={(e) => onDueDateFilterChange(e.target.value)}
          className="text-xs border border-gray-200 rounded-lg px-2.5 py-1 bg-white text-text-secondary cursor-pointer outline-none focus:ring-2 focus:ring-primary/30"
        >
          <option value="all">כל סוגי תג״ב</option>
          <option value="routine">שוטף</option>
          <option value="immediate">מיידי</option>
          <option value="date">תאריך</option>
        </select>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════
// Personal Table
// ═══════════════════════════════════════
interface ColDef {
  id: string;
  label: string;
  sortable: boolean;
  defaultVisible: boolean;
  minWidth?: number;
}

const TABLE_COLUMNS: ColDef[] = [
  { id: 'title', label: 'שם ההנחיה', sortable: true, defaultVisible: true, minWidth: 200 },
  { id: 'description', label: 'פירוט ההנחיה', sortable: false, defaultVisible: true, minWidth: 160 },
  { id: 'assignees', label: 'אחראים', sortable: false, defaultVisible: true, minWidth: 110 },
  { id: 'dueDate', label: 'תג״ב', sortable: true, defaultVisible: true, minWidth: 130 },
  { id: 'source', label: 'מקור', sortable: true, defaultVisible: true, minWidth: 140 },
  { id: 'notesLinks', label: 'הערות וקישורים', sortable: false, defaultVisible: true, minWidth: 120 },
  { id: 'createdAt', label: 'תאריך יצירה', sortable: true, defaultVisible: true, minWidth: 110 },
  { id: 'status', label: 'סטטוס', sortable: false, defaultVisible: true, minWidth: 110 },
  { id: 'updatedAt', label: 'עודכן ב', sortable: true, defaultVisible: true, minWidth: 110 },
  { id: 'environment', label: 'שם הסביבה', sortable: true, defaultVisible: true, minWidth: 110 },
  { id: 'actions', label: '', sortable: false, defaultVisible: true, minWidth: 48 },
];

function PersonalTable({ instructions, onArchive, onRestore, onViewInstruction }: { instructions: PersonalInstruction[]; onArchive: (id: string) => void; onRestore: (id: string) => void; onViewInstruction: (instructionId: string, envId: string) => void }) {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [sortField, setSortField] = useState<string>('createdAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(
    new Set(TABLE_COLUMNS.filter((c) => c.defaultVisible).map((c) => c.id))
  );
  const [columnOrder, setColumnOrder] = useState(TABLE_COLUMNS);
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

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedInstructions = useMemo(() => {
    return [...instructions].sort((a, b) => {
      let aVal: unknown;
      let bVal: unknown;

      if (sortField === 'environment') {
        aVal = a.environmentName;
        bVal = b.environmentName;
      } else {
        aVal = a[sortField as keyof InstructionListItem];
        bVal = b[sortField as keyof InstructionListItem];
      }

      if (aVal === null || aVal === undefined) return 1;
      if (bVal === null || bVal === undefined) return -1;

      let compare: number;
      if (aVal instanceof Date && bVal instanceof Date) {
        compare = aVal.getTime() - bVal.getTime();
      } else {
        compare = String(aVal).localeCompare(String(bVal), 'he');
      }
      return sortDirection === 'desc' ? -compare : compare;
    });
  }, [instructions, sortField, sortDirection]);

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

  return (
    <div>
      {/* Column visibility toggle */}
      <div className="flex justify-end mb-2 relative" ref={columnMenu.ref}>
        <Tooltip content="הצג/הסתר עמודות">
          <button
            onClick={() => columnMenu.setOpen(!columnMenu.open)}
            className="p-1.5 rounded-md text-text-secondary hover:bg-gray-100 transition-colors cursor-pointer"
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
        <table className="w-full min-w-[900px]">
          <thead>
            <tr className="bg-gray-50">
              <th className="w-12 px-3 py-3">
                <Checkbox
                  checked={instructions.length > 0 && selected.size === instructions.length}
                  indeterminate={selected.size > 0 && selected.size < instructions.length}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  aria-label="בחר הכל"
                />
              </th>
              {activeColumns.map((col) => (
                <th
                  key={col.id}
                  className="px-3 py-3 text-start text-xs font-semibold text-text-secondary whitespace-nowrap"
                  style={{ minWidth: col.minWidth }}
                >
                  {col.sortable ? (
                    <button
                      onClick={() => handleSort(col.id)}
                      className="inline-flex items-center gap-1 cursor-pointer hover:text-text-primary transition-colors"
                    >
                      {col.label}
                      {sortField === col.id && (
                        sortDirection === 'asc'
                          ? <ChevronUp className="w-3 h-3" />
                          : <ChevronDown className="w-3 h-3" />
                      )}
                    </button>
                  ) : (
                    col.label
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedInstructions.map((instruction) => {
              const dueDateInfo = getDueDateDisplay(instruction.dueDate, instruction.status);
              return (
                <tr
                  key={instruction.id}
                  onClick={() => onViewInstruction(instruction.id, instruction.environmentId)}
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
                    />
                  </td>

                  {activeColumns.map((col) => (
                    <td key={col.id} className="px-3 py-2.5">
                      {/* Title */}
                      {col.id === 'title' && (
                        <div className="flex items-center gap-1.5">
                          {instruction.isImportant && (
                            <Tooltip content="הנחיה חשובה">
                              <Flag className="w-4 h-4 text-amber-500 fill-amber-500 shrink-0" />
                            </Tooltip>
                          )}
                          <span className="text-sm font-semibold text-text-primary hover:text-primary transition-colors">
                            {instruction.title}
                          </span>
                          {isNew(instruction.createdAt) && (
                            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[0.65rem] font-semibold rounded bg-info-light text-info">
                              <Sparkles className="w-3 h-3" />
                              חדשה
                            </span>
                          )}
                          {dueDateInfo?.overdue && (
                            <AlertTriangle className="w-3.5 h-3.5 text-error shrink-0" />
                          )}
                        </div>
                      )}

                      {col.id === 'createdAt' && (
                        <span className="text-sm text-text-secondary">{formatDate(instruction.createdAt)}</span>
                      )}

                      {col.id === 'status' && (
                        <StatusChip status={instruction.status} />
                      )}

                      {col.id === 'updatedAt' && (
                        <span className="text-sm text-text-secondary">{formatDate(instruction.updatedAt)}</span>
                      )}

                      {col.id === 'dueDate' && (
                        <div>
                          <span className="text-sm">{formatDate(instruction.dueDate)}</span>
                          {dueDateInfo && (
                            <span className="block text-xs font-medium" style={{ color: dueDateInfo.color }}>
                              {dueDateInfo.text}
                            </span>
                          )}
                        </div>
                      )}

                      {col.id === 'assignees' && (
                        <UserAvatarGroup
                          users={instruction.assignees.map((a) => a.user)}
                          max={3}
                          size={28}
                        />
                      )}

                      {col.id === 'description' && (
                        <span className="text-xs text-text-secondary line-clamp-2 max-w-[200px]">
                          {instruction.description || '—'}
                        </span>
                      )}

                      {col.id === 'environment' && (
                        <span className="inline-block px-2.5 py-0.5 text-xs font-medium rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100">
                          {instruction.environmentName}
                        </span>
                      )}

                      {col.id === 'source' && (
                        <span className="text-sm text-text-secondary truncate max-w-[160px] block">
                          {instruction.source || '—'}
                        </span>
                      )}

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
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Row action menu — rendered via portal outside the table */}
      {rowMenu && (() => {
        const inst = sortedInstructions.find((i) => i.id === rowMenu.id);
        if (!inst) return null;
        return createPortal(
          <div
            ref={rowMenuRef}
            className="fixed z-50 bg-paper rounded-lg shadow-xl border border-gray-200 py-1 min-w-[160px]"
            style={{ top: rowMenu.rect.bottom + 4, left: rowMenu.rect.left }}
          >
            <button
              onClick={() => { onViewInstruction(inst.id, inst.environmentId); setRowMenu(null); }}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-gray-50 text-start cursor-pointer"
            >
              <Edit className="w-4 h-4" /> צפה בהנחיה
            </button>
            <button
              onClick={() => { navigate(`/env/${inst.environmentId}`); setRowMenu(null); }}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-gray-50 text-start cursor-pointer"
            >
              <FolderInput className="w-4 h-4" /> עבור למערך
            </button>
            <div className="border-t border-gray-100 my-1" />
            {inst.status === 'archived' ? (
              <button
                onClick={() => { onRestore(inst.id); setRowMenu(null); }}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-gray-50 text-start cursor-pointer text-emerald-600"
              >
                <Archive className="w-4 h-4" /> שחזור מארכיון
              </button>
            ) : (
              <button
                onClick={() => { onArchive(inst.id); setRowMenu(null); }}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-gray-50 text-start cursor-pointer text-amber-600"
              >
                <Archive className="w-4 h-4" /> העברה לארכיון
              </button>
            )}
          </div>,
          document.body
        );
      })()}
    </div>
  );
}

// ═══════════════════════════════════════
// Personal Cards View
// ═══════════════════════════════════════
function PersonalCards({ instructions, onViewInstruction, onArchive, onRestore }: { instructions: PersonalInstruction[]; onViewInstruction: (instructionId: string, envId: string) => void; onArchive: (id: string) => void; onRestore: (id: string) => void }) {
  const navigate = useNavigate();
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

  // Group by status
  const statusOrder: InstructionStatus[] = ['open', 'in_progress', 'completed', 'archived'];
  const groups = useMemo(() => {
    return statusOrder
      .map((status) => ({
        key: status,
        label: STATUS_LABELS[status],
        color: STATUS_COLORS[status],
        items: instructions.filter((i) => i.status === status),
      }))
      .filter((g) => g.items.length > 0);
  }, [instructions]);

  return (
    <>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {groups.map((group) => (
        <div key={group.key}>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: group.color }} />
            <span className="text-sm font-bold text-text-primary">{group.label}</span>
            <span className="text-xs text-text-disabled bg-gray-100 px-1.5 py-0.5 rounded-full">{group.items.length}</span>
          </div>
          <div className="space-y-3">
            {group.items.map((instruction) => {
              const dueDateInfo = getDueDateDisplay(instruction.dueDate, instruction.status);
              return (
                <div
                  key={instruction.id}
                  onClick={() => onViewInstruction(instruction.id, instruction.environmentId)}
                  className="bg-paper rounded-lg shadow-card p-4 cursor-pointer hover:shadow-hover hover:-translate-y-0.5 transition-all border border-gray-100"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <PriorityChip priority={instruction.priority} />
                    <div className="flex items-center gap-1">
                      <span className="text-[0.65rem] px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 font-medium border border-indigo-100">
                        {instruction.environmentName}
                      </span>
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

                  <div className="flex items-start gap-1.5 mb-2">
                    {instruction.isImportant && (
                      <Flag className="w-4 h-4 text-amber-500 fill-amber-500 shrink-0 mt-0.5" />
                    )}
                    <h4 className="text-sm font-semibold text-text-primary line-clamp-2">
                      {instruction.title}
                      {isNew(instruction.createdAt) && (
                        <Sparkles className="w-3 h-3 text-info inline ms-1" />
                      )}
                    </h4>
                  </div>

                  <div className="flex items-center justify-between">
                    <UserAvatarGroup users={instruction.assignees.map((a) => a.user)} max={3} size={24} />
                    <div className="text-end">
                      {instruction.dueDate ? (
                        <span className="text-xs" style={{ color: dueDateInfo?.color || '#6b7280' }}>
                          {formatDate(instruction.dueDate)}
                        </span>
                      ) : (
                        <span className="text-xs text-amber-500">שגרתית</span>
                      )}
                    </div>
                  </div>

                  {/* Indicators footer */}
                  <div className="flex items-center gap-3 mt-2 pt-2 border-t border-gray-50">
                    {instruction.commentCount > 0 && (
                      <span className="inline-flex items-center gap-0.5 text-[0.65rem] text-text-disabled">
                        <MessageCircle className="w-3 h-3" /> {instruction.commentCount}
                      </span>
                    )}
                    {dueDateInfo?.overdue && (
                      <span className="inline-flex items-center gap-0.5 text-[0.65rem] text-error">
                        <AlertTriangle className="w-3 h-3" /> חריגה
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
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
            onClick={() => { onViewInstruction(inst.id, inst.environmentId); setCardMenu(null); }}
            className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-gray-50 text-start cursor-pointer"
          >
            <Edit className="w-4 h-4" /> צפה בהנחיה
          </button>
          <button
            onClick={() => { navigate(`/env/${inst.environmentId}`); setCardMenu(null); }}
            className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-gray-50 text-start cursor-pointer"
          >
            <FolderInput className="w-4 h-4" /> עבור למערך
          </button>
          <div className="border-t border-gray-100 my-1" />
          {inst.status === 'archived' ? (
            <button
              onClick={() => { onRestore(inst.id); setCardMenu(null); }}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-gray-50 text-start cursor-pointer text-emerald-600"
            >
              <Archive className="w-4 h-4" /> שחזור מארכיון
            </button>
          ) : (
            <button
              onClick={() => { onArchive(inst.id); setCardMenu(null); }}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-gray-50 text-start cursor-pointer text-amber-600"
            >
              <Archive className="w-4 h-4" /> העברה לארכיון
            </button>
          )}
        </div>,
        document.body
      );
    })()}
    </>
  );
}

// ═══════════════════════════════════════
