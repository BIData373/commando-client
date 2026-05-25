import styled from '@emotion/styled'
import { Download, FilterX, Search } from 'lucide-react'
import type { ReactNode } from 'react'
import { ColumnVisibilityDropdown } from '../Tasks/ColumnVisibilityDropdown'
import type { TaskColumn, TaskColumnMeta } from '../../hooks/useTaskColumns'

interface FilterBarProps {
  children: ReactNode
  hasActiveFilters: boolean
  onClearAll: () => void
  searchQuery: string
  onSearchChange: (value: string) => void
  onExport: () => void
  columnOrder: TaskColumn[]
  hiddenColumns: Set<TaskColumn>
  onColumnOrderChange: (order: TaskColumn[]) => void
  onToggleColumn: (columnId: TaskColumn) => void
  extraColumnsMeta?: TaskColumnMeta[]
}

function FilterBar({
  children,
  hasActiveFilters,
  onClearAll,
  searchQuery,
  onSearchChange,
  onExport,
  columnOrder,
  hiddenColumns,
  onColumnOrderChange,
  onToggleColumn,
  extraColumnsMeta,
}: FilterBarProps) {
  return (
    <BarRoot>
      <BarStart>
        <ColumnVisibilityDropdown
          columnOrder={columnOrder}
          hiddenColumns={hiddenColumns}
          onColumnOrderChange={onColumnOrderChange}
          onToggleColumn={onToggleColumn}
          extraColumnsMeta={extraColumnsMeta}
        />
        <ActionButton onClick={onExport}>
          <Download size={16} />
          ייצוא
        </ActionButton>
        <SearchInputWrapper>
          <SearchField
            placeholder="חפש הנחייה"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          <SearchIconBox>
            <SearchIcon size={16} />
          </SearchIconBox>
        </SearchInputWrapper>
      </BarStart>
      <BarEnd>
        {hasActiveFilters && (
          <ClearButton onClick={onClearAll}>
            <FilterX size={16} />
            נקה סננים
          </ClearButton>
        )}
        {children}
      </BarEnd>
    </BarRoot>
  )
}

export { FilterBar }

const BarRoot = styled.div`
  direction: ltr;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 40px;
`

const BarStart = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

const BarEnd = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

const ClearButton = styled.button`
  direction: rtl;
  display: flex;
  align-items: center;
  gap: 8px;
  padding-inline: 15px;
  height: 32px;
  border-radius: 999px;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.88);
  cursor: pointer;
  background: transparent;
  white-space: nowrap;

  &:hover {
    background: var(--link-bg-hover);
  }
`

const ActionButton = styled.button`
  direction: rtl;
  display: flex;
  align-items: center;
  gap: 8px;
  padding-inline: 15px;
  height: 40px;
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  font-size: 16px;
  color: rgba(0, 0, 0, 0.88);
  cursor: pointer;
  background: white;
  white-space: nowrap;
  box-shadow: 0px 2px 0px 0px rgba(0, 0, 0, 0.02);

  &:hover {
    background: var(--link-bg-hover);
  }
`

const SearchInputWrapper = styled.div`
  direction: rtl;
  display: flex;
  align-items: center;
  height: 40px;
  width: 222px;
  border: 0.5px solid rgba(0, 0, 0, 0.25);
  border-radius: 6px;
  background: white;
  overflow: hidden;

  &:focus-within {
    border-color: rgba(9, 88, 217, 0.6);
  }
`

const SearchIconBox = styled.div`
  display: flex;
  width: 32px;
  height: 32px;
  justify-content: center;
  align-items: center;
  gap: 8px;
`

const SearchIcon = styled(Search)`
  color: rgba(0, 0, 0, 0.25);
`

const SearchField = styled.input`
  flex: 1;
  height: 100%;
  border: none;
  outline: none;
  background: transparent;
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  color: rgba(0, 0, 0, 0.88);
  padding-inline: 11px;
  text-align: right;
  direction: rtl;

  &::placeholder {
    color: rgba(0, 0, 0, 0.25);
  }
`

export const FilterPill = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 4px;
  padding-inline: 12px;
  height: 32px;
  border-radius: 999px;
  font-size: 14px;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.15s;
  border: 1px solid ${({ $active }) => ($active ? 'rgba(9, 88, 217, 0.6)' : '#D9D9D9')};
  background: #FFF;
  color: ${({ $active }) => ($active ? 'rgba(9, 88, 217, 1)' : 'var(--sea-ink)')};

  &:hover {
    background: var(--link-bg-hover);
  }
`

export const FilterDivider = styled.div`
  width: 1px;
  height: 25px;
  background: var(--Colors-Neutral-Text-colorTextQuaternary, rgba(0, 0, 0, 0.25));
`
