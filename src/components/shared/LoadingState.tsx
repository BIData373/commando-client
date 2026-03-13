import styled from '@emotion/styled';
import Spinner from './Spinner';

interface LoadingStateProps {
  message?: string;
}

export default function LoadingState({ message = 'טוען נתונים...' }: LoadingStateProps) {
  return (
    <Wrapper>
      <Spinner $size={40} />
      <Message>{message}</Message>
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
`;

const Message = styled.p`
  font-size: 0.875rem;
  color: var(--color-text-secondary);
`;
