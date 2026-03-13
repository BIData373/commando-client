import styled from '@emotion/styled';
import type { InstructionStatus } from '../../types';
import { STATUS_COLORS, STATUS_LABELS } from '../../types';

type StatusSize = 'small' | 'medium';

interface StatusChipProps {
  status: InstructionStatus;
  size?: StatusSize;
}

interface ChipProps {
  $size: StatusSize;
  $color: string;
}

export default function StatusChip({ status, size = 'small' }: StatusChipProps) {
  const color = STATUS_COLORS[status];
  const label = STATUS_LABELS[status];

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
