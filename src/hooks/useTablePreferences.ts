import { useState, useEffect, useRef, useCallback } from 'react';
import type { SortDirection } from '@/types';

export type QuickFilterType = 'all' | 'overdue' | 'routine' | 'important' | 'archived';

export interface TablePreferences {
  sortColumn: string | null;
  sortDirection: SortDirection | null;
  columnFilters: Record<string, string[]>;
  quickFilter: QuickFilterType;
}

const DEFAULT_PREFERENCES: TablePreferences = {
  sortColumn: null,
  sortDirection: null,
  columnFilters: {},
  quickFilter: 'all',
};

function getStorageKey(envId: string): string {
  return `table-prefs-${envId}`;
}

function loadPreferences(envId: string): TablePreferences {
  try {
    const raw = localStorage.getItem(getStorageKey(envId));
    if (!raw) return DEFAULT_PREFERENCES;
    const parsed = JSON.parse(raw);
    // Validate shape
    if (typeof parsed !== 'object' || parsed === null) return DEFAULT_PREFERENCES;
    return {
      sortColumn: typeof parsed.sortColumn === 'string' ? parsed.sortColumn : null,
      sortDirection: parsed.sortDirection === 'asc' || parsed.sortDirection === 'desc' ? parsed.sortDirection : null,
      columnFilters: typeof parsed.columnFilters === 'object' && parsed.columnFilters !== null ? parsed.columnFilters : {},
      quickFilter: ['all', 'overdue', 'routine', 'important', 'archived'].includes(parsed.quickFilter) ? parsed.quickFilter : 'all',
    };
  } catch {
    return DEFAULT_PREFERENCES;
  }
}

export function useTablePreferences(envId: string) {
  const [preferences, setPreferences] = useState<TablePreferences>(() => loadPreferences(envId));
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Reload when envId changes
  useEffect(() => {
    setPreferences(loadPreferences(envId));
  }, [envId]);

  // Debounced save to localStorage
  useEffect(() => {
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      localStorage.setItem(getStorageKey(envId), JSON.stringify(preferences));
    }, 300);
    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [preferences, envId]);

  /** 3-state sort toggle: null → asc → desc → null */
  const setSort = useCallback((column: string) => {
    setPreferences((prev) => {
      if (prev.sortColumn !== column) {
        return { ...prev, sortColumn: column, sortDirection: 'asc' };
      }
      if (prev.sortDirection === 'asc') {
        return { ...prev, sortDirection: 'desc' };
      }
      // desc → back to default
      return { ...prev, sortColumn: null, sortDirection: null };
    });
  }, []);

  const setColumnFilter = useCallback((column: string, values: string[]) => {
    setPreferences((prev) => ({
      ...prev,
      columnFilters: {
        ...prev.columnFilters,
        [column]: values,
      },
    }));
  }, []);

  const clearColumnFilter = useCallback((column: string) => {
    setPreferences((prev) => {
      const next = { ...prev.columnFilters };
      delete next[column];
      return { ...prev, columnFilters: next };
    });
  }, []);

  const clearAllFilters = useCallback(() => {
    setPreferences((prev) => ({
      ...prev,
      columnFilters: {},
      quickFilter: 'all',
    }));
  }, []);

  const setQuickFilter = useCallback((filter: QuickFilterType) => {
    setPreferences((prev) => ({ ...prev, quickFilter: filter }));
  }, []);

  const hasActiveFilters = Object.values(preferences.columnFilters).some((v) => v.length > 0)
    || preferences.quickFilter !== 'all';

  const hasActiveSort = preferences.sortColumn !== null;

  return {
    preferences,
    setSort,
    setColumnFilter,
    clearColumnFilter,
    clearAllFilters,
    setQuickFilter,
    hasActiveFilters,
    hasActiveSort,
  };
}
