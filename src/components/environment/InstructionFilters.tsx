import styled from '@emotion/styled';
import type { QuickFilterType } from '../../hooks/useTablePreferences';

export type { QuickFilterType };

interface FilterChip {
  value: QuickFilterType;
  label: string;
  color: string;
}

interface InstructionFiltersProps {
  activeQuickFilter: QuickFilterType;
  onQuickFilterChange: (filter: QuickFilterType) => void;
  /** Extra content rendered at the end of the row */
  endAdornment?: React.ReactNode;
}

const quickFilterChips: FilterChip[] = [
  { value: 'all', label: 'הכול', color: 'var(--color-info)' },
  { value: 'overdue', label: 'חריגה מתג״ב', color: 'var(--color-error)' },
  { value: 'routine', label: 'הנחיות שוטפות', color: 'var(--color-success)' },
  { value: 'important', label: 'הנחיות חשובות', color: 'var(--color-warning)' },
  { value: 'archived', label: 'ארכיון', color: 'var(--color-text-disabled)' },
];

export default function InstructionFilters({
  activeQuickFilter,
  onQuickFilterChange,
  endAdornment,
}: InstructionFiltersProps) {
  return (
    <Root>
      <ChipList>
        {quickFilterChips.map((chip) => (
          <Chip
            key={chip.value}
            $active={activeQuickFilter === chip.value}
            $color={chip.color}
            onClick={() => onQuickFilterChange(chip.value)}
            aria-label={`סנן לפי ${chip.label}`}
          >
            {chip.label}
          </Chip>
        ))}
      </ChipList>
      {endAdornment}
    </Root>
  );
}

const Root = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const ChipList = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const Chip = styled.button<{ $active: boolean; $color: string }>`
  border-radius: 9999px;
  padding: 0.25rem 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  transition: background-color 150ms, color 150ms, border-color 150ms;
  cursor: pointer;
  border: 1px solid;
  border-color: ${({ $active, $color }) => ($active ? $color : 'var(--color-gray-200)')};
  background-color: ${({ $active, $color }) =>
    $active ? `color-mix(in srgb, ${$color} 12%, transparent)` : 'transparent'};
  color: ${({ $active, $color }) => ($active ? $color : 'var(--color-text-secondary)')};

  &:hover {
    border-color: ${({ $color }) => $color};
    color: ${({ $color }) => $color};
    background-color: ${({ $color }) => `color-mix(in srgb, ${$color} 8%, transparent)`};
  }
`;
