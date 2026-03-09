import { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

/* ─── Types ─── */

export type ToastVariant = 'success' | 'error' | 'warning' | 'info';

interface ToastItem {
  id: string;
  message: string;
  variant: ToastVariant;
  duration: number;
  exiting: boolean;
}

interface ToastContextValue {
  addToast: (message: string, variant: ToastVariant, duration?: number) => void;
}

/* ─── Context ─── */

const ToastContext = createContext<ToastContextValue | null>(null);

/* ─── Variant Config ─── */

const VARIANT_CONFIG: Record<
  ToastVariant,
  { icon: React.ElementType; bg: string; border: string; text: string; iconColor: string }
> = {
  success: {
    icon: CheckCircle,
    bg: 'bg-green-50',
    border: 'border-green-200',
    text: 'text-green-800',
    iconColor: 'text-green-500',
  },
  error: {
    icon: XCircle,
    bg: 'bg-red-50',
    border: 'border-red-200',
    text: 'text-red-800',
    iconColor: 'text-red-500',
  },
  warning: {
    icon: AlertTriangle,
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    text: 'text-amber-800',
    iconColor: 'text-amber-500',
  },
  info: {
    icon: Info,
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-800',
    iconColor: 'text-blue-500',
  },
};

/* ─── Toast Component ─── */

interface ToastProps {
  item: ToastItem;
  onClose: (id: string) => void;
}

function Toast({ item, onClose }: ToastProps) {
  const config = VARIANT_CONFIG[item.variant];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        'flex items-center gap-3 px-4 py-3 rounded-xl border shadow-hover pointer-events-auto min-w-[320px] max-w-[480px]',
        config.bg,
        config.border,
        item.exiting ? 'toast-exit' : 'toast-enter'
      )}
      role="alert"
      aria-live="assertive"
    >
      <Icon className={cn('w-5 h-5 shrink-0', config.iconColor)} />
      <p className={cn('flex-1 text-sm font-medium', config.text)}>{item.message}</p>
      <button
        onClick={() => onClose(item.id)}
        className={cn(
          'p-1 rounded-md shrink-0 transition-colors cursor-pointer',
          config.text,
          'opacity-60 hover:opacity-100'
        )}
        aria-label="סגור דגל"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

/* ─── Toast Container ─── */

function ToastContainer({
  toasts,
  onClose,
}: {
  toasts: ToastItem[];
  onClose: (id: string) => void;
}) {
  if (toasts.length === 0) return null;

  return createPortal(
    <div
      className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] flex flex-col items-center gap-2 pointer-events-none"
      aria-label="דגלי מערכת"
    >
      {toasts.map((toast) => (
        <Toast key={toast.id} item={toast} onClose={onClose} />
      ))}
    </div>,
    document.body
  );
}

/* ─── Toast Provider ─── */

let idCounter = 0;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const removeToast = useCallback((id: string) => {
    // Start exit animation
    setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, exiting: true } : t)));
    // Remove after animation completes
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 250);
    // Clear auto-dismiss timer
    const timer = timersRef.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timersRef.current.delete(id);
    }
  }, []);

  const addToast = useCallback(
    (message: string, variant: ToastVariant, duration = 3000) => {
      const id = `toast-${++idCounter}`;
      const newToast: ToastItem = { id, message, variant, duration, exiting: false };
      setToasts((prev) => [...prev, newToast]);

      // Auto-dismiss
      if (duration > 0) {
        const timer = setTimeout(() => removeToast(id), duration);
        timersRef.current.set(id, timer);
      }
    },
    [removeToast]
  );

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      timersRef.current.forEach((timer) => clearTimeout(timer));
    };
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </ToastContext.Provider>
  );
}

/* ─── useToast Hook ─── */

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }

  return {
    success: (message: string, duration?: number) => context.addToast(message, 'success', duration),
    error: (message: string, duration?: number) => context.addToast(message, 'error', duration),
    warning: (message: string, duration?: number) => context.addToast(message, 'warning', duration),
    info: (message: string, duration?: number) => context.addToast(message, 'info', duration),
  };
}
