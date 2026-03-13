import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import { type ReactNode, useEffect } from 'react';

type DialogSize = 'sm' | 'md' | 'lg' | 'wide';

interface DialogProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  size?: DialogSize;
}

const DIALOG_MAX_WIDTHS: Record<DialogSize, string> = {
  sm: '28rem',
  md: '32rem',
  lg: '42rem',
  wide: '60vw',
};

const DIALOG_MIN_WIDTHS: Record<DialogSize, string> = {
  sm: 'auto',
  md: 'auto',
  lg: 'auto',
  wide: '700px',
};

export default function Dialog({ open, onClose, children, size = 'md' }: DialogProps) {
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open) return null;

  return (
    <Overlay>
      <Backdrop onClick={onClose} />
      <Panel $size={size}>{children}</Panel>
    </Overlay>
  );
}

const fadeIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;

const zoomIn = keyframes`
  from { transform: scale(0.95); opacity: 0; }
  to   { transform: scale(1);    opacity: 1; }
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${fadeIn} 150ms ease;
`;

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgb(0 0 0 / 0.5);
`;

const Panel = styled.div<{ $size: DialogSize }>`
  position: relative;
  z-index: 50;
  width: 100%;
  margin: 1rem;
  max-width: ${({ $size }) => DIALOG_MAX_WIDTHS[$size]};
  min-width: ${({ $size }) => DIALOG_MIN_WIDTHS[$size]};
  background-color: var(--color-paper);
  border-radius: var(--radius-md);
  box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25);
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  animation: ${zoomIn} 150ms ease;
`;
