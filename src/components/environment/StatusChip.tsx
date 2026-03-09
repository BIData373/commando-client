import { cn } from '@/lib/utils';
import type { InstructionStatus, InstructionPriority } from '@/types';
import { STATUS_LABELS, STATUS_COLORS, PRIORITY_LABELS, PRIORITY_COLORS } from '@/types';

interface StatusChipProps {
  status: InstructionStatus;
  size?: 'small' | 'medium';
}

export function StatusChip({ status, size = 'small' }: StatusChipProps) {
  const color = STATUS_COLORS[status];
  const label = STATUS_LABELS[status];

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-semibold',
        size === 'small' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-[0.85rem]'
      )}
      style={{ backgroundColor: `${color}18`, color }}
    >
      {label}
    </span>
  );
}

interface PriorityChipProps {
  priority: InstructionPriority;
  size?: 'small' | 'medium';
}

export function PriorityChip({ priority, size = 'small' }: PriorityChipProps) {
  const color = PRIORITY_COLORS[priority];
  const label = PRIORITY_LABELS[priority];

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-semibold',
        size === 'small' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-[0.85rem]'
      )}
      style={{ backgroundColor: `${color}18`, color }}
    >
      {label}
    </span>
  );
}
