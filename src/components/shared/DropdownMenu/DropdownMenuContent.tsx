import styled from '@emotion/styled';
import * as React from 'react';
import { type DropdownAlign, DropdownMenuContext } from './DropdownMenu';

interface DropdownMenuContentProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: DropdownAlign;
}

export default function DropdownMenuContent({
  children,
  align = 'end',
  ...props
}: DropdownMenuContentProps) {
  const { open, setOpen } = React.useContext(DropdownMenuContext);

  React.useEffect(() => {
    if (!open) return;
    const handleClick = () => setOpen(false);
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [open, setOpen]);

  if (!open) return null;

  return (
    <ContentWrapper $align={align} onClick={(e) => e.stopPropagation()} {...props}>
      {children}
    </ContentWrapper>
  );
}

const ContentWrapper = styled.div<{ $align: DropdownAlign }>`
  position: absolute;
  z-index: 50;
  margin-top: 0.25rem;
  min-width: 180px;
  border-radius: 0.5rem;
  border: 1px solid var(--color-gray-200);
  background-color: var(--color-paper);
  padding: 0.25rem 0;
  box-shadow: 0 10px 30px rgb(0 0 0 / 0.1);
  ${({ $align }) => ($align === 'end' ? 'inset-inline-end: 0;' : 'inset-inline-start: 0;')}
`;
