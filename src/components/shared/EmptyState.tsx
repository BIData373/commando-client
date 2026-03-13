import styled from '@emotion/styled';
import { Inbox } from 'lucide-react';
import type { ReactNode } from 'react';
import Button from './Button';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <Wrapper>
      <IconWrapper>{icon || <Inbox size={64} />}</IconWrapper>
      <Title>{title}</Title>
      {description && <Description>{description}</Description>}
      {actionLabel && onAction && <Button onClick={onAction}>{actionLabel}</Button>}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  gap: 1rem;
  text-align: center;
`;

const IconWrapper = styled.div`
  color: var(--color-text-disabled);
`;

const Title = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--color-text-primary);
`;

const Description = styled.p`
  font-size: 0.875rem;
  color: var(--color-text-secondary);
`;
