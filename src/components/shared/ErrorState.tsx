import styled from '@emotion/styled';
import { AlertCircle } from 'lucide-react';
import Button from './Button';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export default function ErrorState({ message = 'תקלה בטעינת הנתונים', onRetry }: ErrorStateProps) {
  return (
    <Wrapper>
      <ErrorIcon />
      <Message>{message}</Message>
      {onRetry && (
        <RetryButton variant="outline" onClick={onRetry}>
          נסה שוב
        </RetryButton>
      )}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 0;
  gap: 0.75rem;
  text-align: center;
`;

const ErrorIcon = styled(AlertCircle)`
  width: 3.5rem;
  height: 3.5rem;
  color: var(--color-error);
`;

const Message = styled.h3`
  font-size: 1.125rem;
  color: var(--color-text-secondary);
`;

const RetryButton = styled(Button)`
  margin-top: 0.5rem;
`;
