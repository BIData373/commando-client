import styled from '@emotion/styled';
import type { HTMLAttributes } from 'react';

export default function TabsList({ ...props }: HTMLAttributes<HTMLDivElement>) {
  return <Wrapper role="tablist" {...props} />;
}

const Wrapper = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  border-bottom: 1px solid var(--color-gray-200);
`;
