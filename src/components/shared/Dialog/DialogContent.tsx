import styled from '@emotion/styled';
import type { HTMLAttributes } from 'react';

export default function DialogContent({ ...props }: HTMLAttributes<HTMLDivElement>) {
  return <Content {...props} />;
}

const Content = styled.div`
  padding: 1rem 1.5rem;
`;
