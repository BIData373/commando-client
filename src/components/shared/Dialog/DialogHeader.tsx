import styled from '@emotion/styled';
import type { HTMLAttributes } from 'react';

export default function DialogHeader({ ...props }: HTMLAttributes<HTMLDivElement>) {
  return <Wrapper {...props} />;
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  padding: 1.5rem 1.5rem 0.5rem;
`;
