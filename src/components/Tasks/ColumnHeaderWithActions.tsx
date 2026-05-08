import { useState } from 'react'
import styled from '@emotion/styled'
import { TbArrowsSort } from 'react-icons/tb'
import { ColumnFilterDropdown } from './ColumnFilterDropdown'
import type { FilterOption, SortDirection } from '../../functions/filterUtils'

interface ColumnHeaderWithActionsProps {
  label: string
  canFilter?: boolean
  canSort?: boolean
  filterOptions?: FilterOption[]
  activeFilterValues?: Set<string>
  onApplyFilter?: (values: Set<string>) => void
  isSortActive?: boolean
  sortDirection?: SortDirection
  onToggleSort?: () => void
}

function ColumnHeaderWithActions({
  label,
  canFilter,
  canSort,
  filterOptions = [],
  activeFilterValues,
  onApplyFilter,
  isSortActive = false,
  onToggleSort,
}: ColumnHeaderWithActionsProps) {
  const [filterOpen, setFilterOpen] = useState(false)
  const isFilterActive = (activeFilterValues?.size ?? 0) > 0
  const alwaysShow = isFilterActive || isSortActive || filterOpen

  return (
    <HeaderWrapper $alwaysShow={alwaysShow}>
      <span>{label}</span>
      <ActionsArea data-slot="actions-area" $show={alwaysShow}>
        {canFilter && onApplyFilter && (
          <ColumnFilterDropdown
            options={filterOptions}
            activeValues={activeFilterValues ?? emptySet}
            onApply={onApplyFilter}
            isActive={isFilterActive}
            open={filterOpen}
            onOpenChange={setFilterOpen}
          />
        )}
        {canSort && (
          <SortIconButton $active={isSortActive} onClick={onToggleSort}>
            <TbArrowsSort size={16} />
            {isSortActive && <ActiveBadge />}
          </SortIconButton>
        )}
      </ActionsArea>
    </HeaderWrapper>
  )
}

export { ColumnHeaderWithActions }

const emptySet = new Set<string>()

// ─── Styled ──────────────────────────────────────────────────────────────────

const ActiveBadge = styled.span`
  position: absolute;
  top: -2px;
  inset-inline-start: -2px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #1677FF;
`

const SortIconButton = styled.button<{ $active: boolean }>`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border: none;
  background: none;
  padding: 0;
  cursor: pointer;
  color: ${({ $active }) => ($active ? '#1677FF' : 'rgba(0, 0, 0, 0.45)')};
  flex-shrink: 0;

  &:hover {
    color: ${({ $active }) => ($active ? '#1677FF' : 'rgba(0, 0, 0, 0.65)')};
  }
`

const ActionsArea = styled.div<{ $show: boolean }>`
  display: flex;
  align-items: center;
  gap: 2px;
  flex-shrink: 0;
  opacity: ${({ $show }) => ($show ? 1 : 0)};
  transition: opacity 0.15s;
`

const HeaderWrapper = styled.div<{ $alwaysShow: boolean }>`
  display: flex;
  align-items: center;
  height: 100%;

  &:hover [data-slot="actions-area"] {
    opacity: 1;
  }
`
