import styled from '@emotion/styled';
import { type InstructionPriority, PRIORITY_COLORS, PRIORITY_LABELS } from '../../types';

type PrioritySize = 'small' | 'medium';

interface PriorityChipProps {
  priority: InstructionPriority;
  size?: PrioritySize;
}

interface ChipProps {
  $size: PrioritySize;
  $color: string;
}

export default function PriorityChip({ priority, size = 'small' }: PriorityChipProps) {
  const color = PRIORITY_COLORS[priority];
  const label = PRIORITY_LABELS[priority];

  return (
    <Chip $size={size} $color={color}>
      {label}
    </Chip>
  );
}

const Chip = styled.span<ChipProps>`
  display: inline-flex;
  align-items: center;
  border-radius: 9999px;
  font-weight: 600;
  background-color: ${({ $color }) => $color}18;
  color: ${({ $color }) => $color};
  ${({ $size }) =>
    $size === 'small'
      ? 'padding: 0.125rem 0.625rem; font-size: 0.75rem;'
      : 'padding: 0.25rem 0.75rem; font-size: 0.85rem;'}
`;
