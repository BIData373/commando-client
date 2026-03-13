import styled from '@emotion/styled';
import { createPortal } from 'react-dom';
import type { ToastItem } from './Toast';
import Toast from './Toast';

interface ToastContainerProps {
  toasts: ToastItem[];
  onClose: (id: string) => void;
}

export default function ToastContainer({ toasts, onClose }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return createPortal(
    <ToastStack aria-label="דגלי מערכת">
      {toasts.map((toast) => (
        <Toast key={toast.id} item={toast} onClose={onClose} />
      ))}
    </ToastStack>,
    document.body
  );
}

const ToastStack = styled.div`
  position: fixed;
  top: 1rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  pointer-events: none;
`;
