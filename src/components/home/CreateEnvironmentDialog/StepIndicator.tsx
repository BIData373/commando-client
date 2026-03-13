import styled from '@emotion/styled';
import { Check } from 'lucide-react';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export default function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
  return (
    <StepRow>
      {Array.from({ length: totalSteps }, (_, i) => {
        const stepNum = i + 1;
        const isCompleted = stepNum < currentStep;
        const isActive = stepNum === currentStep;
        return (
          <StepItem key={stepNum}>
            <StepCircle $completed={isCompleted} $active={isActive}>
              {isCompleted ? <Check size={14} /> : stepNum}
            </StepCircle>
            {i < totalSteps - 1 && <StepLine $completed={isCompleted} />}
          </StepItem>
        );
      })}
    </StepRow>
  );
}

const StepRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const StepItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
`;

const StepCircle = styled.div<{ $completed: boolean; $active: boolean }>`
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 700;
  flex-shrink: 0;
  transition: background-color 150ms, color 150ms;
  background-color: ${({ $completed, $active }) =>
    $completed
      ? 'var(--color-success)'
      : $active
        ? 'var(--color-primary)'
        : 'var(--color-gray-200)'};
  color: ${({ $completed, $active }) =>
    $completed || $active ? 'var(--color-paper)' : 'var(--color-text-disabled)'};
`;

const StepLine = styled.div<{ $completed: boolean }>`
  flex: 1;
  height: 2px;
  border-radius: 9999px;
  transition: background-color 150ms;
  background-color: ${({ $completed }) =>
    $completed ? 'var(--color-success)' : 'var(--color-gray-200)'};
`;
