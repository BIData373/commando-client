import styled from '@emotion/styled';
import type { HTMLAttributes } from 'react';

export default function DialogTitle({ ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return <Title {...props} />;
}

const Title = styled.h2`
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
`;
