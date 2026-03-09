import { useState } from 'react';
import { cn } from '@/lib/utils';
import { ChevronUp, ChevronDown, Filter } from 'lucide-react';
import { ColumnFilterDropdown } from './ColumnFilterDropdown';
import type { SortDirection } from '@/types';

interface FilterOption {
  value: string;
  label: string;
}

interface ColumnHeaderCellProps {
  label: string;
  minWidth?: number;
  sortable: boolean;
  filterable: boolean;
  sortState: { column: string | null; direction: SortDirection | null };
  columnId: string;
  filterValues: string[];
  filterOptions: FilterOption[];
  onSort: () => void;
  onFilterApply: (values: string[]) => void;
  onFilterReset: () => void;
}

export function ColumnHeaderCell({
  label,
  minWidth,
  sortable,
  filterable,
  sortState,
  columnId,
  filterValues,
  filterOptions,
  onSort,
  onFilterApply,
  onFilterReset,
}: ColumnHeaderCellProps) {
  const [filterOpen, setFilterOpen] = useState(false);

  const isSortActive = sortState.column === columnId;
  const isFilterActive = filterValues.length > 0;

  return (
    <th
      className="px-3 py-3 text-start text-xs font-semibold text-text-secondary whitespace-nowrap group relative"
      style={{ minWidth }}
    >
      <div className="inline-flex items-center gap-1">
        {/* Label + Sort */}
        {sortable ? (
          <button
            onClick={onSort}
            className="inline-flex items-center gap-1 cursor-pointer hover:text-text-primary transition-colors"
          >
            {label}
            {/* Sort icon: visible on hover, always visible when active */}
            <span
              className={cn(
                'relative inline-flex items-center transition-opacity',
                isSortActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
              )}
            >
              {isSortActive && sortState.direction === 'asc' && (
                <ChevronUp className="w-3 h-3" />
              )}
              {isSortActive && sortState.direction === 'desc' && (
                <ChevronDown className="w-3 h-3" />
              )}
              {!isSortActive && (
                <ChevronUp className="w-3 h-3 text-text-disabled" />
              )}
              {/* Blue dot indicator */}
              {isSortActive && (
                <span className="absolute -top-0.5 -end-0.5 w-1.5 h-1.5 rounded-full bg-primary" />
              )}
            </span>
          </button>
        ) : (
          <span>{label}</span>
        )}

        {/* Filter icon */}
        {filterable && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setFilterOpen(!filterOpen);
            }}
            className={cn(
              'relative p-0.5 rounded transition-all cursor-pointer',
              isFilterActive
                ? 'opacity-100 text-primary'
                : 'opacity-0 group-hover:opacity-100 text-text-disabled hover:text-text-secondary'
            )}
            aria-label={`סנן לפי ${label}`}
          >
            <Filter className="w-3 h-3" />
            {/* Blue dot indicator */}
            {isFilterActive && (
              <span className="absolute -top-0.5 -end-0.5 w-1.5 h-1.5 rounded-full bg-primary" />
            )}
          </button>
        )}
      </div>

      {/* Filter dropdown */}
      {filterOpen && (
        <ColumnFilterDropdown
          options={filterOptions}
          selected={filterValues}
          onApply={onFilterApply}
          onReset={onFilterReset}
          onClose={() => setFilterOpen(false)}
        />
      )}
    </th>
  );
}
