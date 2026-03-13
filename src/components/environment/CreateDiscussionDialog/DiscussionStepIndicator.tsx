import styled from '@emotion/styled';
import { Check } from 'lucide-react';

interface DiscussionStepIndicatorProps {
  step: number;
  current: number;
  label: string;
}

export default function DiscussionStepIndicator({
  step,
  current,
  label,
}: DiscussionStepIndicatorProps) {
  const isCompleted = current > step;
  const isActive = current >= step;

  return (
    <Wrapper>
      <StepCircle $completed={isCompleted} $active={isActive}>
        {isCompleted ? <Check size={16} /> : step}
      </StepCircle>
      <StepLabel $active={isActive}>{label}</StepLabel>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const StepCircle = styled.div<{ $completed: boolean; $active: boolean }>`
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  font-weight: 500;
  transition: background-color 150ms, color 150ms;
  flex-shrink: 0;
  background-color: ${({ $completed, $active }) =>
    $completed
      ? 'var(--color-success)'
      : $active
        ? 'var(--color-primary)'
        : 'var(--color-gray-100)'};
  color: ${({ $completed, $active }) =>
    $completed || $active ? 'var(--color-paper)' : 'var(--color-text-disabled)'};
`;

const StepLabel = styled.span<{ $active: boolean }>`
  font-size: 0.875rem;
  font-weight: ${({ $active }) => ($active ? '500' : '400')};
  color: ${({ $active }) => ($active ? 'var(--color-text-primary)' : 'var(--color-text-disabled)')};
`;
