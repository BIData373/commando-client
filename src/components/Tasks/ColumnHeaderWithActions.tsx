import { useState } from 'react'
import styled from '@emotion/styled'
import { type Column } from '@tanstack/react-table'
import { TbArrowsSort } from 'react-icons/tb'
import { ColumnFilterDropdown } from './ColumnFilterDropdown'
import type { FilterOption } from '../../functions/filter-utils'

interface ColumnHeaderWithActionsProps<TData> {
  label: string
  column: Column<TData, unknown>
  labelMap?: Record<string, string>
}

function ColumnHeaderWithActions<TData>({
  label,
  column,
  labelMap,
}: ColumnHeaderWithActionsProps<TData>) {
  const [filterOpen, setFilterOpen] = useState(false)
  const canFilter = column.getCanFilter()

  const facetedValues = column.getFacetedUniqueValues()
  const filterOptions: FilterOption[] = Array.from(facetedValues.keys())
    .filter(Boolean)
    .flatMap((v) => (Array.isArray(v) ? v : [v]))
    .filter((v, i, arr) => arr.indexOf(v) === i)
    .map((v) => ({ value: String(v), label: labelMap?.[String(v)] ?? String(v) }))
  const canSort = column.getCanSort()
  const filterValue = (column.getFilterValue() as string[] | undefined) ?? []
  const isFilterActive = filterValue.length > 0
  const isSortActive = column.getIsSorted() !== false
  const alwaysShow = isFilterActive || isSortActive || filterOpen

  function handleApplyFilter(values: Set<string>) {
    column.setFilterValue(values.size > 0 ? [...values] : undefined)
  }

  return (
    <HeaderWrapper $alwaysShow={alwaysShow}>
      <span>{label}</span>
      <ActionsArea data-slot="actions-area" $show={alwaysShow}>
        {canFilter && (
          <ColumnFilterDropdown
            options={filterOptions}
            activeValues={new Set(filterValue)}
            onApply={handleApplyFilter}
            isActive={isFilterActive}
            onOpenChange={setFilterOpen}
          />
        )}
        {canSort && (
          <SortIconButton $active={isSortActive} onClick={() => column.toggleSorting()}>
            <TbArrowsSort size={16} />
            {isSortActive && <ActiveBadge />}
          </SortIconButton>
        )}
      </ActionsArea>
    </HeaderWrapper>
  )
}

export { ColumnHeaderWithActions }

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
