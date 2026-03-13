import styled from '@emotion/styled';
import type { HTMLAttributes } from 'react';

export default function DialogFooter({ ...props }: HTMLAttributes<HTMLDivElement>) {
  return <Footer {...props} />;
}

const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.5rem;
  padding: 0.5rem 1.5rem 1.5rem;
`;
