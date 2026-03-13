import styled from '@emotion/styled';
import { ChevronDown, ChevronUp, Filter } from 'lucide-react';
import { useState } from 'react';
import type { SortDirection } from '../../../types';
import ColumnFilterDropdown from './ColumnFilterDropdown';

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

export default function ColumnHeaderCell({
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

  const handleFilterToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFilterOpen(!filterOpen);
  };

  return (
    <Th $minWidth={minWidth}>
      <InnerRow>
        {sortable ? (
          <SortButton onClick={onSort}>
            {label}
            <SortIconWrapper $visible={isSortActive}>
              {isSortActive && sortState.direction === 'asc' && <ChevronUp size={12} />}
              {isSortActive && sortState.direction === 'desc' && <ChevronDown size={12} />}
              {!isSortActive && <InactiveSortIcon size={12} />}
              {isSortActive && <ActiveDot />}
            </SortIconWrapper>
          </SortButton>
        ) : (
          <span>{label}</span>
        )}

        {filterable && (
          <FilterButton
            $active={isFilterActive}
            onClick={handleFilterToggle}
            aria-label={`סנן לפי ${label}`}
          >
            <Filter size={12} />
            {isFilterActive && <ActiveDot />}
          </FilterButton>
        )}
      </InnerRow>

      {filterOpen && (
        <ColumnFilterDropdown
          options={filterOptions}
          selected={filterValues}
          onApply={onFilterApply}
          onReset={onFilterReset}
          onClose={() => setFilterOpen(false)}
        />
      )}
    </Th>
  );
}

const Th = styled.th<{ $minWidth?: number }>`
  min-width: ${({ $minWidth }) => ($minWidth ? `${$minWidth}px` : 'unset')};
  padding: 0.75rem;
  text-align: start;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-text-secondary);
  white-space: nowrap;
  position: relative;
`;

const InnerRow = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
`;

const SortButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  background: none;
  border: none;
  cursor: pointer;
  font-size: inherit;
  font-weight: inherit;
  color: inherit;
  transition: color 150ms;

  &:hover {
    color: var(--color-text-primary);
  }

  &:hover > span {
    opacity: 1;
  }
`;

const SortIconWrapper = styled.span<{ $visible: boolean }>`
  position: relative;
  display: inline-flex;
  align-items: center;
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  transition: opacity 150ms;
`;

const InactiveSortIcon = styled(ChevronUp)`
  color: var(--color-text-disabled);
`;

const ActiveDot = styled.span`
  position: absolute;
  top: -2px;
  inset-inline-end: -2px;
  width: 6px;
  height: 6px;
  border-radius: 9999px;
  background-color: var(--color-primary);
`;

const FilterButton = styled.button<{ $active: boolean }>`
  position: relative;
  padding: 0.125rem;
  border-radius: 0.25rem;
  background: none;
  border: none;
  cursor: pointer;
  transition: opacity 150ms, color 150ms;

  opacity: ${({ $active }) => ($active ? 1 : 0)};
  color: ${({ $active }) => ($active ? 'var(--color-primary)' : 'var(--color-text-disabled)')};

  ${Th}:hover & {
    opacity: 1;
  }

  &:hover {
    color: var(--color-text-secondary);
  }
`;
