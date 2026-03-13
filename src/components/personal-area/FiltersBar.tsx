import styled from '@emotion/styled';
import { LayoutGrid, Table2 } from 'lucide-react';
import type { ChangeEvent } from 'react';
import Tooltip from '../shared/Tooltip';

export type StatusTab = 'all' | 'open' | 'inProgress' | 'completed' | 'archived';
export type QuickFilter = 'all' | 'overdue' | 'routine' | 'important';
export type ViewMode = 'table' | 'cards';

const STATUS_TABS: { value: StatusTab; label: string }[] = [
  { value: 'all', label: 'הכל' },
  { value: 'open', label: 'ממתין לביצוע' },
  { value: 'inProgress', label: 'בביצוע' },
  { value: 'completed', label: 'בוצע' },
  { value: 'archived', label: 'ארכיון' },
];

const QUICK_FILTERS: { value: QuickFilter; label: string }[] = [
  { value: 'all', label: 'הכול' },
  { value: 'overdue', label: 'חריגה מתג״ב' },
  { value: 'routine', label: 'הנחיות שוטפות' },
  { value: 'important', label: 'הנחיות חשובות' },
];

const TABS = [
  { key: 'table' as ViewMode, icon: <Table2 size={16} />, label: 'טבלה' },
  { key: 'cards' as ViewMode, icon: <LayoutGrid size={16} />, label: 'כרטיסיות' },
];

interface FiltersBarProps {
  activeTab: StatusTab;
  onTabChange: (tab: StatusTab) => void;
  quickFilter: QuickFilter;
  onQuickFilterChange: (f: QuickFilter) => void;
  envFilter: string;
  onEnvFilterChange: (v: string) => void;
  envOptions: { id: string; name: string }[];
  dueDateFilter: string;
  onDueDateFilterChange: (v: string) => void;
  viewMode: ViewMode;
  onViewModeChange: (v: ViewMode) => void;
}

export default function FiltersBar({
  activeTab,
  onTabChange,
  quickFilter,
  onQuickFilterChange,
  envFilter,
  onEnvFilterChange,
  envOptions,
  dueDateFilter,
  onDueDateFilterChange,
  viewMode,
  onViewModeChange,
}: FiltersBarProps) {
  function handleEnvFilterChange(e: ChangeEvent<HTMLSelectElement>) {
    onEnvFilterChange(e.target.value);
  }

  return (
    <Root>
      <TopRow>
        <TabList>
          {STATUS_TABS.map((tab) => (
            <TabButton
              key={tab.value}
              $active={activeTab === tab.value}
              onClick={() => onTabChange(tab.value)}
            >
              {tab.label}
            </TabButton>
          ))}
        </TabList>

        <ViewToggle>
          {TABS.map((view) => (
            <Tooltip key={view.key} content={view.label}>
              <ViewToggleButton
                $active={viewMode === view.key}
                onClick={() => onViewModeChange(view.key)}
              >
                {view.icon}
              </ViewToggleButton>
            </Tooltip>
          ))}
        </ViewToggle>
      </TopRow>

      <BottomRow>
        {QUICK_FILTERS.map((filter) => (
          <QuickFilterButton
            key={filter.value}
            $active={quickFilter === filter.value}
            onClick={() => onQuickFilterChange(filter.value)}
          >
            {filter.label}
          </QuickFilterButton>
        ))}

        <Divider />

        <FilterSelect value={envFilter} onChange={handleEnvFilterChange}>
          <option value="all">כל המערכים</option>
          {envOptions.map((e) => (
            <option key={e.id} value={e.id}>
              {e.name}
            </option>
          ))}
        </FilterSelect>

        <FilterSelect value={dueDateFilter} onChange={(e) => onDueDateFilterChange(e.target.value)}>
          <option value="all">כל סוגי תג״ב</option>
          <option value="routine">שוטף</option>
          <option value="immediate">מיידי</option>
          <option value="date">תאריך</option>
        </FilterSelect>
      </BottomRow>
    </Root>
  );
}

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const TopRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const TabList = styled.div`
  display: flex;
  gap: 0.25rem;
`;

const TabButton = styled.button<{ $active: boolean }>`
  padding: 0.375rem 0.875rem;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 0.5rem;
  border: none;
  cursor: pointer;
  transition: background-color 150ms, color 150ms;

  background-color: ${({ $active }) => ($active ? 'var(--color-primary)' : 'transparent')};
  color: ${({ $active }) => ($active ? '#ffffff' : 'var(--color-text-secondary)')};

  &:hover {
    background-color: ${({ $active }) => ($active ? 'var(--color-primary)' : '#f3f4f6')};
  }
`;

const ViewToggle = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  background-color: #f3f4f6;
  border-radius: 0.5rem;
  padding: 0.125rem;
`;

const ViewToggleButton = styled.button<{ $active: boolean }>`
  padding: 0.375rem;
  border-radius: 0.375rem;
  border: none;
  cursor: pointer;
  transition: background-color 150ms, color 150ms;

  background-color: ${({ $active }) => ($active ? '#ffffff' : 'transparent')};
  color: ${({ $active }) => ($active ? 'var(--color-primary)' : 'var(--color-text-secondary)')};
  box-shadow: ${({ $active }) => ($active ? '0 1px 2px rgb(0 0 0 / 0.05)' : 'none')};

  &:hover {
    color: ${({ $active }) => ($active ? 'var(--color-primary)' : 'var(--color-text-primary)')};
  }
`;

const BottomRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const QuickFilterButton = styled.button<{ $active: boolean }>`
  padding: 0.25rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 9999px;
  cursor: pointer;
  transition: background-color 150ms, color 150ms;

  background-color: ${({ $active }) => ($active ? 'var(--color-primary)' : '#ffffff')};
  color: ${({ $active }) => ($active ? '#ffffff' : 'var(--color-text-secondary)')};
  border: 1px solid ${({ $active }) => ($active ? 'var(--color-primary)' : '#e5e7eb')};

  &:hover {
    background-color: ${({ $active }) => ($active ? 'var(--color-primary)' : '#f9fafb')};
  }
`;

const Divider = styled.span`
  width: 1px;
  height: 1.25rem;
  background-color: #e5e7eb;
  margin: 0 0.25rem;
`;

const FilterSelect = styled.select`
  font-size: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 0.25rem 0.625rem;
  background-color: #ffffff;
  color: var(--color-text-secondary);
  cursor: pointer;
  outline: none;

  &:focus {
    box-shadow: 0 0 0 2px color-mix(in srgb, var(--color-primary) 30%, transparent);
  }
`;
