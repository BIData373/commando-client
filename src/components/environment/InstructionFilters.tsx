import type { QuickFilterType } from '@/hooks/useTablePreferences';

export type { QuickFilterType };

interface InstructionFiltersProps {
  activeQuickFilter: QuickFilterType;
  onQuickFilterChange: (filter: QuickFilterType) => void;
  /** Extra content rendered at the end of the row */
  endAdornment?: React.ReactNode;
}

const quickFilterChips: { value: QuickFilterType; label: string; color: string }[] = [
  { value: 'all', label: 'הכול', color: '#3b82f6' },
  { value: 'overdue', label: 'חריגה מתג״ב', color: '#ef4444' },
  { value: 'routine', label: 'הנחיות שוטפות', color: '#10b981' },
  { value: 'important', label: 'הנחיות חשובות', color: '#f59e0b' },
  { value: 'archived', label: 'ארכיון', color: '#9ca3af' },
];

export function InstructionFilters({
  activeQuickFilter,
  onQuickFilterChange,
  endAdornment,
}: InstructionFiltersProps) {
  return (
    <div className="flex items-center justify-between flex-wrap gap-2">
      <div className="flex gap-2 flex-wrap">
        {quickFilterChips.map((chip) => {
          const isActive = activeQuickFilter === chip.value;
          return (
            <button
              key={chip.value}
              onClick={() => onQuickFilterChange(chip.value)}
              className="rounded-full px-3 py-1 text-sm font-medium transition-colors cursor-pointer border"
              style={{
                borderColor: isActive ? chip.color : '#e5e7eb',
                backgroundColor: isActive ? `${chip.color}15` : 'transparent',
                color: isActive ? chip.color : '#6b7280',
              }}
              aria-label={`סנן לפי ${chip.label}`}
            >
              {chip.label}
            </button>
          );
        })}
      </div>
      {endAdornment}
    </div>
  );
}
