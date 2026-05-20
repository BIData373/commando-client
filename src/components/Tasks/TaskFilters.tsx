import styled from '@emotion/styled'
import { FilterX } from 'lucide-react'
import type { Task } from '../../data/Tasks'
import { matchesQuickFilter } from '../../functions/filter-utils'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'
import { TopicFilterDropdown } from './TopicFilterDropdown'
import { QuickFilter } from '#/utils/filterUtils'

interface TaskFiltersProps {
  tasks: Task[]
  activeQuickFilters: Set<QuickFilter>
  activeTopicFilters: Set<string>
  allTopics: string[]
  onToggleQuickFilter: (filter: QuickFilter) => void
  onApplyTopicFilters: (topics: Set<string>) => void
  onClearAllFilters: () => void
}

function TaskFilters({
  tasks,
  activeQuickFilters,
  activeTopicFilters,
  allTopics,
  onToggleQuickFilter,
  onApplyTopicFilters,
  onClearAllFilters,
}: TaskFiltersProps) {
  const hasActiveFilters = activeQuickFilters.size > 0 || activeTopicFilters.size > 0

  const overdueCount = tasks.filter((t) => matchesQuickFilter(t, 'overdue')).length
  const approachingCount = tasks.filter((t) => matchesQuickFilter(t, 'approaching')).length
  const flaggedCount = tasks.filter((t) => matchesQuickFilter(t, 'flagged')).length

  return (
    <ToolbarEnd>
      {hasActiveFilters && (
        <ClearFiltersButton onClick={onClearAllFilters}>
          <FilterX size={16} />
          נקה סננים
        </ClearFiltersButton>
      )}
      <TopicFilterDropdown
        topics={allTopics}
        activeTopics={activeTopicFilters}
        onApply={onApplyTopicFilters}
        $active={activeTopicFilters.size > 0}
      />
      <FilterPill $active={activeQuickFilters.has(QuickFilter.FLAGGED)} onClick={() => onToggleQuickFilter(QuickFilter.FLAGGED)}>
            חשובות ({flaggedCount})
          </FilterPill>
          <Tooltip>
            <WarningTrigger>
              <FilterPill $active={activeQuickFilters.has(QuickFilter.APPROACHING)} onClick={() => onToggleQuickFilter(QuickFilter.APPROACHING)}>
                תג"ב מתקרב ({approachingCount})
              </FilterPill>
            </WarningTrigger>
            <TooltipContent>תג"ב בעוד 2 ימים או פחות</TooltipContent>
          </Tooltip>
      <FilterPill $active={activeQuickFilters.has(QuickFilter.OVERDUE)} onClick={() => onToggleQuickFilter(QuickFilter.OVERDUE)}>
      חריגה מתג"ב ({overdueCount})
    </FilterPill>
    <FilterDivider />
    <FilterPill $active={!hasActiveFilters} onClick={onClearAllFilters}>
      הכל ({tasks.length})
    </FilterPill>
  </ToolbarEnd>
  )
}

export { TaskFilters }

const ToolbarEnd = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

const ClearFiltersButton = styled.button`
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

const FilterPill = styled.button<{ $active: boolean }>`
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

const FilterDivider = styled.div`
  width: 1px;
  height: 25px;
  background: var(--Colors-Neutral-Text-colorTextQuaternary, rgba(0, 0, 0, 0.25));
`

const WarningTrigger = styled(TooltipTrigger)`
  display: inline-flex;
  align-items: center;
  background: none;
  border: none;
  padding: 0;
  cursor: default;
  line-height: 0;
`
