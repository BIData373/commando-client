import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import { AlertTriangle, CheckCircle, Info, X, XCircle } from 'lucide-react';
import type { ElementType } from 'react';

export type ToastVariant = 'success' | 'error' | 'warning' | 'info';

export interface ToastItem {
  id: string;
  message: string;
  variant: ToastVariant;
  duration: number;
  exiting: boolean;
}

export const VARIANT_CONFIG: Record<
  ToastVariant,
  { icon: ElementType; bg: string; border: string; color: string }
> = {
  success: {
    icon: CheckCircle,
    bg: 'var(--color-success-light)',
    border: 'color-mix(in srgb, var(--color-success) 30%, transparent)',
    color: 'var(--color-success)',
  },
  error: {
    icon: XCircle,
    bg: 'var(--color-error-light)',
    border: 'color-mix(in srgb, var(--color-error) 30%, transparent)',
    color: 'var(--color-error)',
  },
  warning: {
    icon: AlertTriangle,
    bg: 'var(--color-warning-light)',
    border: 'color-mix(in srgb, var(--color-warning) 30%, transparent)',
    color: 'var(--color-warning)',
  },
  info: {
    icon: Info,
    bg: 'var(--color-info-light)',
    border: 'color-mix(in srgb, var(--color-info) 30%, transparent)',
    color: 'var(--color-info)',
  },
};

const slideDown = keyframes`
  from { opacity: 0; transform: translateY(-0.5rem); }
  to   { opacity: 1; transform: translateY(0); }
`;

const fadeOut = keyframes`
  from { opacity: 1; }
  to   { opacity: 0; }
`;

interface ToastProps {
  item: ToastItem;
  onClose: (id: string) => void;
}

export default function Toast({ item, onClose }: ToastProps) {
  const config = VARIANT_CONFIG[item.variant];
  const Icon = config.icon;

  return (
    <ToastWrapper
      $bg={config.bg}
      $border={config.border}
      $color={config.color}
      $exiting={item.exiting}
      role="alert"
      aria-live="assertive"
    >
      <IconWrapper>
        <Icon size={20} />
      </IconWrapper>
      <ToastMessage>{item.message}</ToastMessage>
      <CloseButton onClick={() => onClose(item.id)} aria-label="סגור דגל">
        <X size={16} />
      </CloseButton>
    </ToastWrapper>
  );
}

const ToastWrapper = styled.div<{
  $bg: string;
  $border: string;
  $color: string;
  $exiting: boolean;
}>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: 0.75rem;
  border: 1px solid ${({ $border }) => $border};
  background-color: ${({ $bg }) => $bg};
  color: ${({ $color }) => $color};
  box-shadow: var(--shadow-hover);
  pointer-events: auto;
  min-width: 320px;
  max-width: 480px;
  animation: ${({ $exiting }) => ($exiting ? fadeOut : slideDown)}
    ${({ $exiting }) => ($exiting ? '250ms' : '200ms')} ease forwards;
`;

const IconWrapper = styled.span`
  flex-shrink: 0;
  display: flex;
`;

const ToastMessage = styled.p`
  flex: 1;
  font-size: 0.875rem;
  font-weight: 500;
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 0.375rem;
  color: inherit;
  opacity: 0.6;
  flex-shrink: 0;
  transition: opacity 150ms;

  &:hover {
    opacity: 1;
  }
`;
