import { useContext } from 'react';
import { ToastContext } from '../providers/ToastProvider';

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within a ToastProvider');

  return {
    success: (message: string, duration?: number) => context.addToast(message, 'success', duration),
    error: (message: string, duration?: number) => context.addToast(message, 'error', duration),
    warning: (message: string, duration?: number) => context.addToast(message, 'warning', duration),
    info: (message: string, duration?: number) => context.addToast(message, 'info', duration),
  };
}
