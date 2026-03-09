import { Inbox } from 'lucide-react';
import { Button } from '@/components/ui';
import type { ReactNode } from 'react';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="mb-4 text-text-disabled">
        {icon || <Inbox className="w-16 h-16" />}
      </div>
      <h3 className="text-lg text-text-secondary mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-text-disabled mb-6 max-w-[400px]">{description}</p>
      )}
      {actionLabel && onAction && (
        <Button onClick={onAction}>{actionLabel}</Button>
      )}
    </div>
  );
}
