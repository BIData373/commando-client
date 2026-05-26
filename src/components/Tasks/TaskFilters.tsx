import type { ReactNode } from 'react'
import styled from '@emotion/styled'
import type { Task } from '../../data/Tasks'
import { matchesQuickFilter } from '../../functions/filter-utils'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'
import { FilterBar, FilterPill, FilterDivider } from '../shared/FilterBar'
import type { TaskColumn, TaskColumnMeta } from '../../hooks/useTaskColumns'
import { QuickFilter } from '#/utils/filterUtils'

interface TaskFiltersProps {
  tasks: Task[]
  activeQuickFilters: Set<QuickFilter>
  onToggleQuickFilter: (filter: QuickFilter) => void
  onClearAllFilters: () => void
  searchQuery: string
  onSearchChange: (value: string) => void
  onExport: () => void
  columnOrder: TaskColumn[]
  hiddenColumns: Set<TaskColumn>
  onColumnOrderChange: (order: TaskColumn[]) => void
  onToggleColumn: (columnId: TaskColumn) => void
  hasExtraActiveFilters?: boolean
  extraFilters?: ReactNode
  extraColumnsMeta?: TaskColumnMeta[]
}

function TaskFilters({
  tasks,
  activeQuickFilters,
  onToggleQuickFilter,
  onClearAllFilters,
  searchQuery,
  onSearchChange,
  onExport,
  columnOrder,
  hiddenColumns,
  onColumnOrderChange,
  onToggleColumn,
  hasExtraActiveFilters,
  extraFilters,
  extraColumnsMeta,
}: TaskFiltersProps) {
  const hasActiveFilters = activeQuickFilters.size > 0 || !!hasExtraActiveFilters

  const overdueCount = tasks.filter((t) => matchesQuickFilter(t,QuickFilter.OVERDUE)).length
  const approachingCount = tasks.filter((t) => matchesQuickFilter(t, QuickFilter.APPROACHING)).length
  const flaggedCount = tasks.filter((t) => matchesQuickFilter(t, QuickFilter.FLAGGED)).length

  return (
    <FilterBar
      hasActiveFilters={hasActiveFilters}
      onClearAll={onClearAllFilters}
      searchQuery={searchQuery}
      onSearchChange={onSearchChange}
      onExport={onExport}
      columnOrder={columnOrder}
      hiddenColumns={hiddenColumns}
      onColumnOrderChange={onColumnOrderChange}
      onToggleColumn={onToggleColumn}
      extraColumnsMeta={extraColumnsMeta}
    >
      {extraFilters} 
      <FilterPill $active={activeQuickFilters.has(QuickFilter.FLAGGED)} onClick={() => onToggleQuickFilter(QuickFilter.FLAGGED)}>
        חשובות{flaggedCount > 0 && ` (${flaggedCount})`}
      </FilterPill>
      <Tooltip>
        <WarningTrigger>
          <FilterPill $active={activeQuickFilters.has(QuickFilter.APPROACHING)} onClick={() => onToggleQuickFilter(QuickFilter.APPROACHING)}>
            תג"ב מתקרב{approachingCount > 0 && ` (${approachingCount})`}
          </FilterPill>
        </WarningTrigger>
        <TooltipContent>תג"ב בעוד 2 ימים או פחות</TooltipContent>
      </Tooltip>
      <FilterPill $active={activeQuickFilters.has(QuickFilter.OVERDUE)} onClick={() => onToggleQuickFilter(QuickFilter.OVERDUE)}>
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

const WarningTrigger = styled(TooltipTrigger)`
  display: inline-flex;
  align-items: center;
  background: none;
  border: none;
  padding: 0;
  cursor: default;
  line-height: 0;
`
