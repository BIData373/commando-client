import type { ReactNode } from 'react';
import { createContext, useEffect, useRef, useState } from 'react';
import type { ToastItem, ToastVariant } from '../components/shared/Toast/Toast';
import ToastContainer from '../components/shared/Toast/ToastContainer';

export interface ToastContextValue {
  addToast: (message: string, variant: ToastVariant, duration?: number) => void;
}

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastContext = createContext<ToastContextValue | null>(null);

export default function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());
  const idCounterRef = useRef(0);

  function removeToast(id: string) {
    setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, exiting: true } : t)));
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 250);
    const timer = timersRef.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timersRef.current.delete(id);
    }
  }

  function addToast(message: string, variant: ToastVariant, duration = 3000) {
    const id = `toast-${++idCounterRef.current}`;
    setToasts((prev) => [...prev, { id, message, variant, duration, exiting: false }]);
    if (duration > 0) {
      const timer = setTimeout(() => removeToast(id), duration);
      timersRef.current.set(id, timer);
    }
  }

  useEffect(() => {
    return () => {
      timersRef.current.forEach((timer) => {
        clearTimeout(timer);
      });
    };
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </ToastContext.Provider>
  );
}
