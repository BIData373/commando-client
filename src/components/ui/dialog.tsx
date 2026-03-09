import * as React from 'react';
import { cn } from '@/lib/utils';


type DialogSize = 'sm' | 'md' | 'lg' | 'wide';

const DIALOG_SIZE_CLASSES: Record<DialogSize, string> = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  wide: 'max-w-[60vw] min-w-[700px]',
};

interface DialogProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  size?: DialogSize;
}

function Dialog({ open, onClose, children, size = 'md' }: DialogProps) {
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className={cn(
        'relative z-50 w-full mx-4 bg-paper rounded-[12px] shadow-xl animate-in fade-in-0 zoom-in-95 max-h-[90vh] flex flex-col',
        DIALOG_SIZE_CLASSES[size]
      )}>
        {children}
      </div>
    </div>
  );
}

function DialogHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('flex flex-col gap-1.5 p-6 pb-2', className)} {...props} />;
}

function DialogTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h2 className={cn('text-lg font-semibold', className)} {...props} />;
}

function DialogContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('px-6 py-4', className)} {...props} />;
}

function DialogFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('flex items-center justify-end gap-2 p-6 pt-2', className)} {...props} />
  );
}

export { Dialog, DialogHeader, DialogTitle, DialogContent, DialogFooter };
