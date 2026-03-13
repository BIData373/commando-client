import styled from '@emotion/styled';
import { type ButtonHTMLAttributes, useContext } from 'react';
import { TabsContext } from './Tabs';

interface TabsTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
}

export default function TabsTrigger({ value, children, ...props }: TabsTriggerProps) {
  const ctx = useContext(TabsContext);
  const isActive = ctx.value === value;

  return (
    <TriggerButton
      role="tab"
      aria-selected={isActive}
      onClick={() => ctx.onValueChange(value)}
      $active={isActive}
      {...props}
    >
      {children}
    </TriggerButton>
  );
}

const TriggerButton = styled.button<{ $active: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 0.75rem 0.625rem;
  font-size: 0.875rem;
  font-weight: 500;
  border: none;
  border-bottom: 3px solid ${({ $active }) => ($active ? 'var(--color-primary)' : 'transparent')};
  margin-bottom: -1px;
  background: none;
  cursor: pointer;
  color: ${({ $active }) => ($active ? 'var(--color-primary)' : 'var(--color-text-secondary)')};
  transition: color 150ms, border-color 150ms;

  &:hover {
    color: ${({ $active }) => ($active ? 'var(--color-primary)' : 'var(--color-text-primary)')};
    border-color: ${({ $active }) => ($active ? 'var(--color-primary)' : 'var(--color-gray-300)')};
  }
`;
