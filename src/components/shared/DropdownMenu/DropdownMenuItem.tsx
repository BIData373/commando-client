import styled from '@emotion/styled';
import * as React from 'react';
import { DropdownMenuContext } from './DropdownMenu';

interface DropdownMenuItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  destructive?: boolean;
}

export default function DropdownMenuItem({
  children,
  destructive,
  onClick,
  ...props
}: DropdownMenuItemProps) {
  const { setOpen } = React.useContext(DropdownMenuContext);

  function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    onClick?.(e);
    setOpen(false);
  }

  return (
    <ItemButton type="button" $destructive={!!destructive} onClick={handleClick} {...props}>
      {children}
    </ItemButton>
  );
}

const ItemButton = styled.button<{ $destructive: boolean }>`
  display: flex;
  width: 100%;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  border: none;
  background: none;
  cursor: pointer;
  text-align: start;
  transition: background-color 150ms;
  color: ${({ $destructive }) => ($destructive ? 'var(--color-error)' : 'var(--color-text-primary)')};

  &:hover {
    background-color: ${({ $destructive }) =>
      $destructive ? 'var(--color-error-light)' : 'var(--color-gray-50)'};
  }
`;
