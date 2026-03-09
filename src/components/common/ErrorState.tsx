import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  message = 'תקלה בטעינת הנתונים',
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
      <AlertCircle className="w-14 h-14 text-error" />
      <h3 className="text-lg text-text-secondary">{message}</h3>
      {onRetry && (
        <Button variant="outline" onClick={onRetry} className="mt-2">
          נסה שוב
        </Button>
      )}
    </div>
  );
}
