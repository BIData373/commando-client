import type { ReactNode } from 'react'
import styled from '@emotion/styled'
import { matchesQuickFilter } from '../../functions/filter-utils'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'
import { FilterBar, FilterPill, FilterDivider } from '../shared/FilterBar'
import type { TaskColumnMeta } from '../../hooks/useTaskColumns'
import { useTasks } from '../../providers/TasksProvider'

type QuickFilter = 'overdue' | 'approaching' | 'flagged'

interface TaskFiltersProps {
  onClearAllFilters: () => void
  onExport: () => void
  hasExtraActiveFilters?: boolean
  extraFilters?: ReactNode
  extraColumnsMeta?: TaskColumnMeta[]
}

function TaskFilters({
  onClearAllFilters,
  onExport,
  hasExtraActiveFilters,
  extraFilters,
  extraColumnsMeta,
}: TaskFiltersProps) {
  const {
    tasks, activeQuickFilters, toggleQuickFilter,
    searchQuery, setSearchQuery,
    columnOrder, setColumnOrder,
    hiddenColumns, toggleColumn,
  } = useTasks()

  const hasActiveFilters = activeQuickFilters.size > 0 || !!hasExtraActiveFilters

  const overdueCount = tasks.filter((t) => matchesQuickFilter(t, 'overdue')).length
  const approachingCount = tasks.filter((t) => matchesQuickFilter(t, 'approaching')).length
  const flaggedCount = tasks.filter((t) => matchesQuickFilter(t, 'flagged')).length

  return (
    <FilterBar
      hasActiveFilters={hasActiveFilters}
      onClearAll={onClearAllFilters}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      onExport={onExport}
      columnOrder={columnOrder}
      hiddenColumns={hiddenColumns}
      onColumnOrderChange={setColumnOrder}
      onToggleColumn={toggleColumn}
      extraColumnsMeta={extraColumnsMeta}
    >
      {extraFilters}
      <FilterPill $active={activeQuickFilters.has('flagged')} onClick={() => toggleQuickFilter('flagged')}>
        חשובות{flaggedCount > 0 && ` (${flaggedCount})`}
      </FilterPill>
      <Tooltip>
        <WarningTrigger>
          <FilterPill $active={activeQuickFilters.has('approaching')} onClick={() => toggleQuickFilter('approaching')}>
            תג"ב מתקרב{approachingCount > 0 && ` (${approachingCount})`}
          </FilterPill>
        </WarningTrigger>
        <TooltipContent>תג"ב בעוד 2 ימים או פחות</TooltipContent>
      </Tooltip>
      <FilterPill $active={activeQuickFilters.has('overdue')} onClick={() => toggleQuickFilter('overdue')}>
        חריגה מתג"ב{overdueCount > 0 && ` (${overdueCount})`}
      </FilterPill>
      <FilterDivider />
      <FilterPill $active={!hasActiveFilters} onClick={onClearAllFilters}>
        הכל ({tasks.length})
      </FilterPill>
    </FilterBar>
  )
}

export { TaskFilters }
export type { QuickFilter }

const WarningTrigger = styled(TooltipTrigger)`
  display: inline-flex;
  align-items: center;
  background: none;
  border: none;
  padding: 0;
  cursor: default;
  line-height: 0;
`
