import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button, Tooltip, useToast } from '@/components/ui';
import {
  Plus, Table2, LayoutGrid, Download,
  Search, X, FileText, MessagesSquare, ChevronDown,
} from 'lucide-react';
import { useEnvironment } from '@/hooks/useEnvironments';
import { useInstructions, useInstructionStats, useUpdateInstruction, useDeleteInstruction } from '@/hooks/useInstructions';
import { useTablePreferences } from '@/hooks/useTablePreferences';
import { EnvironmentTopbar } from '@/components/environment/EnvironmentSidebar';
import type { SidebarItem } from '@/components/environment/EnvironmentSidebar';
import { InstructionFilters } from '@/components/environment/InstructionFilters';
import { InstructionsTable } from '@/components/environment/InstructionsTable';
import type { ColumnFilterOptions } from '@/components/environment/InstructionsTable';
import { CardsView } from '@/components/environment/CardsView';
import { CreateInstructionDialog } from '@/components/environment/CreateInstructionDialog';
import { EnvironmentHomeDashboard } from '@/components/environment/EnvironmentHomeDashboard';
import { InstructionViewModal } from '@/components/environment/InstructionViewModal';
import { ConfirmDeleteDialog } from '@/components/environment/ConfirmDeleteDialog';
import { LoadingState, ErrorState, EmptyState } from '@/components/common';
import type { InstructionListItem } from '@/types';
import { STATUS_LABELS } from '@/types';

type ViewMode = 'table' | 'cards';

export function EnvironmentPage() {
  const { envId } = useParams<{ envId: string }>();
  const [sidebarItem, setSidebarItem] = useState<SidebarItem>('home');
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [searchQuery, setSearchQuery] = useState('');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [createMode, setCreateMode] = useState<'single' | 'discussion'>('single');
  const [createMenuOpen, setCreateMenuOpen] = useState(false);
  const createMenuRef = useRef<HTMLDivElement>(null);
  const [viewModalInstructionId, setViewModalInstructionId] = useState<string | null>(null);
  const [viewModalEditMode, setViewModalEditMode] = useState(false);
  const [deleteDialogInstructionId, setDeleteDialogInstructionId] = useState<string | null>(null);
  const toast = useToast();

  useEffect(() => {
    if (!createMenuOpen) return;
    const handler = (e: MouseEvent) => {
      if (createMenuRef.current && !createMenuRef.current.contains(e.target as Node)) setCreateMenuOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [createMenuOpen]);

  const {
    preferences,
    setSort,
    setColumnFilter,
    clearColumnFilter,
    clearAllFilters,
    setQuickFilter,
    hasActiveFilters,
  } = useTablePreferences(envId || '');

  const {
    data: environment,
    isLoading: envLoading,
    isError: envError,
  } = useEnvironment(envId || '');

  const {
    data: instructionsData,
    isLoading: instLoading,
    isError: instError,
    refetch: refetchInstructions,
  } = useInstructions(envId || '');

  const { data: stats } = useInstructionStats(envId || '');

  const updateMutation = useUpdateInstruction(envId || '');
  const deleteMutation = useDeleteInstruction(envId || '');

  // Extract unique filter options from raw data
  const filterOptions = useMemo<ColumnFilterOptions>(() => {
    const items = instructionsData?.data || [];
    const assigneeMap = new Map<string, string>();

    items.forEach((i) => {
      i.assignees.forEach((a) => assigneeMap.set(a.user.id, a.user.name));
    });

    return {
      assignees: Array.from(assigneeMap, ([value, label]) => ({ value, label })),
      dueDate: [
        { value: 'routine', label: 'שוטף' },
        { value: 'immediate', label: 'מיידי' },
        { value: 'date', label: 'תאריך' },
      ],
      status: [
        { value: 'open', label: STATUS_LABELS.open },
        { value: 'in_progress', label: STATUS_LABELS.in_progress },
        { value: 'completed', label: STATUS_LABELS.completed },
      ],
    };
  }, [instructionsData]);

  // Apply filtering + sorting
  const filteredAndSortedInstructions = useMemo(() => {
    if (!instructionsData?.data) return [];

    let items = instructionsData.data;

    // 1. Quick filter
    const now = new Date();
    switch (preferences.quickFilter) {
      case 'archived':
        items = items.filter((i) => i.status === 'archived');
        break;
      case 'overdue':
        items = items.filter(
          (i) =>
            i.status !== 'archived' &&
            i.dueDate &&
            i.dueDate.getTime() < now.getTime() &&
            i.status !== 'completed'
        );
        break;
      case 'routine':
        items = items.filter((i) => i.status !== 'archived' && i.dueDateType === 'routine');
        break;
      case 'important':
        items = items.filter((i) => i.status !== 'archived' && (i.priority === 'high' || i.priority === 'urgent' || i.isImportant));
        break;
      default:
        // 'all' — exclude archived
        items = items.filter((i) => i.status !== 'archived');
    }

    // 2. Column filters
    const { columnFilters } = preferences;
    if (columnFilters.assignees?.length) {
      items = items.filter((i) =>
        i.assignees.some((a) => columnFilters.assignees.includes(a.user.id))
      );
    }
    if (columnFilters.dueDate?.length) {
      items = items.filter((i) => columnFilters.dueDate.includes(i.dueDateType));
    }
    if (columnFilters.status?.length) {
      items = items.filter((i) => columnFilters.status.includes(i.status));
    }

    // 3. Text search
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      items = items.filter((i) => {
        const titleMatch = i.title.toLowerCase().includes(q);
        const sourceMatch = i.source?.toLowerCase().includes(q);
        const assigneeMatch = i.assignees.some((a) =>
          a.user.name.toLowerCase().includes(q)
        );
        return titleMatch || sourceMatch || tagMatch || assigneeMatch;
      });
    }

    // 4. Sort
    const sortCol = preferences.sortColumn;
    const sortDir = preferences.sortDirection;
    if (sortCol && sortDir) {
      items = [...items].sort((a, b) => {
        const aVal = a[sortCol as keyof InstructionListItem];
        const bVal = b[sortCol as keyof InstructionListItem];
        if (aVal === null || aVal === undefined) return 1;
        if (bVal === null || bVal === undefined) return -1;

        let compare: number;
        if (aVal instanceof Date && bVal instanceof Date) {
          compare = aVal.getTime() - bVal.getTime();
        } else if (typeof aVal === 'string' && typeof bVal === 'string') {
          compare = aVal.localeCompare(bVal, 'he');
        } else {
          compare = String(aVal).localeCompare(String(bVal), 'he');
        }
        return sortDir === 'desc' ? -compare : compare;
      });
    } else {
      // Default: newest first
      items = [...items].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }

    return items;
  }, [instructionsData, sidebarItem, preferences, searchQuery]);

  // Handlers
  const handleArchive = useCallback(
    async (instructionId: string) => {
      try {
        await updateMutation.mutateAsync({
          instructionId,
          data: { status: 'archived' },
        });
        toast.success('ההנחיה הועברה לארכיון בהצלחה');
      } catch {
        toast.error('תקלה בהעברת ההנחיה לארכיון');
      }
    },
    [updateMutation, toast]
  );

  const handleRestore = useCallback(
    async (instructionId: string) => {
      try {
        await updateMutation.mutateAsync({
          instructionId,
          data: { status: 'open' },
        });
        toast.success('ההנחיה שוחזרה מהארכיון בהצלחה');
      } catch {
        toast.error('תקלה בשחזור ההנחיה מהארכיון');
      }
    },
    [updateMutation, toast]
  );

  const handleDeleteConfirm = useCallback(async () => {
    if (!deleteDialogInstructionId) return;
    try {
      await deleteMutation.mutateAsync(deleteDialogInstructionId);
      setDeleteDialogInstructionId(null);
      toast.success('ההנחיה בוטלה בהצלחה');
    } catch {
      toast.error('תקלה בביטול ההנחיה');
    }
  }, [deleteDialogInstructionId, deleteMutation, toast]);

  const deleteInstruction = instructionsData?.data.find(
    (i) => i.id === deleteDialogInstructionId
  );

  if (envLoading) {
    return (
      <div className="min-h-screen bg-background">
        <LoadingState message="טוען מערך..." />
      </div>
    );
  }

  if (envError || !environment) {
    return (
      <div className="min-h-screen bg-background">
        <ErrorState message="תקלה בטעינת המערך" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Navbar */}
      <EnvironmentTopbar
        environmentName={environment.name}
        activeItem={sidebarItem}
        onItemChange={setSidebarItem}
      />

      {/* Secondary Bar: title (right) + create buttons (left) */}
      <div className="bg-paper border-b border-gray-200">
        <div className="flex items-center justify-between px-6 py-2.5 gap-4">
          {/* Right side (RTL start): Title */}
          <h1 className="text-[30px] font-bold text-text-primary">
            {sidebarItem === 'home' ? 'בית' : 'הנחיות'}
          </h1>

          {/* Left side (RTL end): Export + Create button */}
          <div className="flex items-center gap-3">
            {sidebarItem !== 'home' && (
            <Button variant="outline" size="sm" onClick={() => {}}>
              <Download className="w-4 h-4 me-1.5" />
              ייצוא
            </Button>
            )}
            {sidebarItem !== 'home' && (
            <div className="relative" ref={createMenuRef}>
              <Button
                size="sm"
                onClick={() => setCreateMenuOpen(!createMenuOpen)}
                aria-label="הנחיה חדשה"
              >
                <Plus className="w-4 h-4 me-1.5" />
                יצירת הנחיה
                <ChevronDown className={cn('w-3.5 h-3.5 ms-1.5 transition-transform', createMenuOpen && 'rotate-180')} />
              </Button>
              {createMenuOpen && (
                <div className="absolute top-full mt-1 end-0 z-40 bg-paper rounded-lg shadow-xl border border-gray-200 py-1 min-w-[200px]">
                  <button
                    onClick={() => {
                      setCreateMode('single');
                      setCreateDialogOpen(true);
                      setCreateMenuOpen(false);
                    }}
                    className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-start hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <FileText className="w-4 h-4 text-primary" />
                    <div>
                      <span className="font-medium text-text-primary">הנחיה בודדת</span>
                      <p className="text-xs text-text-secondary mt-0.5">יצירת הנחיה חדשה</p>
                    </div>
                  </button>
                  <button
                    onClick={() => {
                      setCreateMode('discussion');
                      setCreateDialogOpen(true);
                      setCreateMenuOpen(false);
                    }}
                    className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-start hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <MessagesSquare className="w-4 h-4 text-primary" />
                    <div>
                      <span className="font-medium text-text-primary">מתוך דיון</span>
                      <p className="text-xs text-text-secondary mt-0.5">חילוץ הנחיות מדיון או ישיבה</p>
                    </div>
                  </button>
                </div>
              )}
            </div>
            )}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 p-6 overflow-y-auto">
        {/* Home Dashboard */}
        {sidebarItem === 'home' && !instLoading && !instError && stats && (
          <EnvironmentHomeDashboard
            envId={envId || ''}
            stats={stats}
            instructions={instructionsData?.data || []}
            onViewInstruction={setViewModalInstructionId}
            onNavigateToInstructions={() => setSidebarItem('instructions')}
            onCreateInstruction={() => setCreateDialogOpen(true)}
          />
        )}
        {sidebarItem === 'home' && instLoading && (
          <LoadingState message="טוען נתונים..." />
        )}

        {sidebarItem === 'instructions' && (
          <>
            {/* Filters + View Toggle */}
            <div className="mb-4">
              <InstructionFilters
                activeQuickFilter={preferences.quickFilter}
                onQuickFilterChange={setQuickFilter}
                endAdornment={
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-disabled" />
                      <input
                        type="text"
                        placeholder="חיפוש..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        aria-label="חיפוש הנחיות"
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
                  <div className="inline-flex rounded-lg border border-gray-200 overflow-hidden">
                    {([
                      { value: 'cards' as ViewMode, icon: LayoutGrid, label: 'כרטיסיות' },
                      { value: 'table' as ViewMode, icon: Table2, label: 'טבלה' },
                    ]).map((item) => (
                      <Tooltip key={item.value} content={item.label}>
                        <button
                          onClick={() => setViewMode(item.value)}
                          className={cn(
                            'p-2 transition-colors cursor-pointer',
                            viewMode === item.value
                              ? 'bg-primary/10 text-primary'
                              : 'text-text-secondary hover:bg-gray-50'
                          )}
                          aria-label={`תצוגת ${item.label}`}
                        >
                          <item.icon className="w-4 h-4" />
                        </button>
                      </Tooltip>
                    ))}
                  </div>
                  </div>
                }
              />
            </div>

            {/* Loading State */}
            {instLoading && <LoadingState message="טוען הנחיות..." />}

            {/* Error State */}
            {instError && (
              <ErrorState
                message="תקלה בטעינת ההנחיות"
                onRetry={() => refetchInstructions()}
              />
            )}

            {/* Table View */}
            {!instLoading &&
              !instError &&
              viewMode === 'table' &&
              filteredAndSortedInstructions.length > 0 && (
                <InstructionsTable
                  instructions={filteredAndSortedInstructions}
                  sortState={{
                    column: preferences.sortColumn,
                    direction: preferences.sortDirection,
                  }}
                  onSort={setSort}
                  columnFilters={preferences.columnFilters}
                  filterOptions={filterOptions}
                  onFilterApply={setColumnFilter}
                  onFilterReset={clearColumnFilter}
                  onViewInstruction={(id) => { setViewModalEditMode(false); setViewModalInstructionId(id); }}
                  onEditInstruction={(id) => { setViewModalEditMode(true); setViewModalInstructionId(id); }}
                  onArchiveInstruction={handleArchive}
                  onRestoreInstruction={handleRestore}
                  onDeleteInstruction={setDeleteDialogInstructionId}
                />
              )}

            {/* Cards View */}
            {!instLoading &&
              !instError &&
              viewMode === 'cards' &&
              filteredAndSortedInstructions.length > 0 && (
                <CardsView
                  instructions={filteredAndSortedInstructions}
                  envId={envId || ''}
                  onViewInstruction={setViewModalInstructionId}
                  onArchiveInstruction={handleArchive}
                  onRestoreInstruction={handleRestore}
                />
              )}

            {/* Empty State */}
            {!instLoading &&
              !instError &&
              (viewMode === 'table' || viewMode === 'cards') &&
              filteredAndSortedInstructions.length === 0 && (
                <EmptyState
                  title="אין הנחיות להצגה"
                  description={
                    searchQuery.trim()
                      ? `לא נמצאו תוצאות עבור "${searchQuery}"`
                      : hasActiveFilters
                        ? 'לא נמצאו הנחיות התואמות את הסינון'
                        : 'צור הנחיה חדשה כדי להתחיל'
                  }
                  actionLabel={
                    hasActiveFilters
                      ? 'נקה סינון'
                      : !searchQuery.trim()
                        ? 'צור הנחיה'
                        : undefined
                  }
                  onAction={
                    hasActiveFilters
                      ? clearAllFilters
                      : !searchQuery.trim()
                        ? () => setCreateDialogOpen(true)
                        : undefined
                  }
                />
              )}

          </>
        )}

      </div>

      {/* Create Instruction Dialog */}
      <CreateInstructionDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        envId={envId || ''}
        initialMode={createMode}
      />

      {/* Instruction View Modal */}
      {viewModalInstructionId && (
        <InstructionViewModal
          open={!!viewModalInstructionId}
          onClose={() => { setViewModalInstructionId(null); setViewModalEditMode(false); }}
          instructionId={viewModalInstructionId}
          envId={envId || ''}
          initialEditMode={viewModalEditMode}
        />
      )}

      {/* Confirm Delete Dialog */}
      <ConfirmDeleteDialog
        open={!!deleteDialogInstructionId}
        onClose={() => setDeleteDialogInstructionId(null)}
        onConfirm={handleDeleteConfirm}
        instructionTitle={deleteInstruction?.title || ''}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
